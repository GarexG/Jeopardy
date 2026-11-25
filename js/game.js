/* ===================================================== */
/* ELEMENTOS */
/* ===================================================== */

const startScreen = document.getElementById("startScreen");
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const questionScreen = document.getElementById("questionScreen");
const roundSummaryScreen = document.getElementById("roundSummaryScreen");
const finalScreen = document.getElementById("finalScreen");

const startButton = document.getElementById("startButton");
const resumeButton = document.getElementById("resumeButton");

const teamCountButtons = document.querySelectorAll(".team-count");
const teamNamesContainer = document.getElementById("teamNames");
const beginGameButton = document.getElementById("beginGameButton");

const scoreboard = document.getElementById("scoreboard");
const board = document.getElementById("board");

const roundTitle = document.getElementById("roundTitle");

const resetButton = document.getElementById("resetButton");
const continueButton = document.getElementById("continueButton");

const questionCategory = document.getElementById("questionCategory");
const questionValue = document.getElementById("questionValue");

const questionText = document.getElementById("questionText");
const questionImage = document.getElementById("questionImage");

const questionAudioContainer =
    document.getElementById("questionAudioContainer");

const questionAudio =
    document.getElementById("questionAudio");

const playAudioButton =
    document.getElementById("playAudioButton");

const answerContainer =
    document.getElementById("answerContainer");

const answerText =
    document.getElementById("answerText");

const answerImage =
    document.getElementById("answerImage");

const showAnswerButton =
    document.getElementById("showAnswerButton");

const returnBoardButton =
    document.getElementById("returnBoardButton");

const summaryTitle =
    document.getElementById("summaryTitle");

const summaryScores =
    document.getElementById("summaryScores");

const nextRoundButton =
    document.getElementById("nextRoundButton");

const finalScores =
    document.getElementById("finalScores");

const newGameButton =
    document.getElementById("newGameButton");


/* ===================================================== */
/* VARIABLES */
/* ===================================================== */

let numberOfTeams = 0;

let teams = [];

let currentRound = 1;

let currentQuestionValue = 100;

let answeredQuestions = 0;

let selectedCell = null;

let currentQuestion = null;


let usedQuestions = {
    1: [],
    2: []
};


/* ===================================================== */
/* VALORES */
/* ===================================================== */

const round1Values = [
    100,
    200,
    300,
    400,
    500
];

const round2Values = [
    200,
    400,
    600,
    800,
    1000
];


/* ===================================================== */
/* GUARDADO */
/* ===================================================== */

const SAVE_KEY = "jeopardySave";


function saveGame() {

    const gameData = {

        teams: teams,

        currentRound: currentRound,

        currentQuestionValue:
            currentQuestionValue,

        usedQuestions:
            usedQuestions
    };


    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(gameData)
    );


    updateResumeButton();
}


function loadSavedGame() {

    const saved =
        localStorage.getItem(SAVE_KEY);


    if (!saved) {
        return false;
    }


    try {

        const gameData =
            JSON.parse(saved);


        teams =
            Array.isArray(gameData.teams)
                ? gameData.teams
                : [];


        currentRound =
            gameData.currentRound || 1;


        currentQuestionValue =
            gameData.currentQuestionValue ||
            (currentRound === 1 ? 100 : 200);


        usedQuestions =
            gameData.usedQuestions || {
                1: [],
                2: []
            };


        if (!usedQuestions[1]) {
            usedQuestions[1] = [];
        }


        if (!usedQuestions[2]) {
            usedQuestions[2] = [];
        }


        numberOfTeams =
            teams.length;


        answeredQuestions =
            usedQuestions[currentRound].length;


        return teams.length > 0;

    } catch (error) {

        console.error(
            "Error cargando partida:",
            error
        );

        return false;
    }
}


function clearSavedGame() {

    localStorage.removeItem(
        SAVE_KEY
    );

    updateResumeButton();
}


function updateResumeButton() {

    const saved =
        localStorage.getItem(SAVE_KEY);


    if (saved) {

        resumeButton.classList.remove(
            "hidden"
        );

    } else {

        resumeButton.classList.add(
            "hidden"
        );
    }
}


/* ===================================================== */
/* CAMBIO DE PANTALLA */
/* ===================================================== */

function showScreen(screen) {

    // Limpiar animaciones de puntuación pendientes

    document.querySelectorAll(".score").forEach(element => {

        element.classList.remove(
            "score-increase",
            "score-decrease"
        );

        element.onanimationend = null;
    });

    // Ocultar todas las pantallas

    document.querySelectorAll(".screen").forEach(section => {

        section.classList.remove("active");

    });

    // Mostrar la pantalla correspondiente

    screen.classList.add("active");
}


/* ===================================================== */
/* INICIO */
/* ===================================================== */

startButton.addEventListener(
    "click",
    () => {

        showScreen(
            setupScreen
        );
    }
);


resumeButton.addEventListener(
    "click",
    () => {

        const loaded =
            loadSavedGame();


        if (!loaded) {

            alert(
                "No se pudo cargar la partida."
            );

            return;
        }


        createScoreboard();

        loadRound();

        showScreen(
            gameScreen
        );
    }
);


/* ===================================================== */
/* EQUIPOS */
/* ===================================================== */

teamCountButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            numberOfTeams =
                Number(
                    button.dataset.count
                );


            teamCountButtons.forEach(
                btn => {

                    btn.classList.remove(
                        "selected"
                    );
                }
            );


            button.classList.add(
                "selected"
            );


            createTeamInputs();
        }
    );
});


function createTeamInputs() {

    teamNamesContainer.innerHTML =
        "";


    for (
        let i = 1;
        i <= numberOfTeams;
        i++
    ) {

        const input =
            document.createElement(
                "input"
            );


        input.type =
            "text";


        input.classList.add(
            "team-name-input"
        );


        input.placeholder =
            `Nombre del equipo ${i}`;


        input.value =
            `Equipo ${i}`;


        teamNamesContainer.appendChild(
            input
        );
    }


    beginGameButton.classList.remove(
        "hidden"
    );
}


/* ===================================================== */
/* COMENZAR */
/* ===================================================== */

beginGameButton.addEventListener(
    "click",
    () => {

        const inputs =
            document.querySelectorAll(
                ".team-name-input"
            );


        teams = [];


        inputs.forEach(
            (input, index) => {

                let name =
                    input.value.trim();


                if (name === "") {

                    name =
                        `Equipo ${index + 1}`;
                }


                teams.push({

                    name: name,

                    score: 0
                });
            }
        );


        currentRound = 1;

        currentQuestionValue = 100;

        answeredQuestions = 0;

        selectedCell = null;


        usedQuestions = {

            1: [],

            2: []
        };


        saveGame();

        createScoreboard();

        loadRound();

        showScreen(
            gameScreen
        );
    }
);


/* ===================================================== */
/* MARCADOR */
/* ===================================================== */

function createScoreboard() {

    scoreboard.innerHTML =
        "";


    teams.forEach(
        (team, index) => {

            const teamCard =
                document.createElement(
                    "div"
                );


            teamCard.classList.add(
                "team-score"
            );


            teamCard.innerHTML = `

                <h3>${team.name}</h3>

                <div
                    class="score"
                    id="score-${index}"
                >
                    ${team.score}
                </div>

                <div class="score-buttons">

                    <button
                        class="subtract-score"
                        data-team="${index}">
                        −
                    </button>

                    <button
                        class="add-score"
                        data-team="${index}">
                        +
                    </button>

                </div>
            `;


            scoreboard.appendChild(
                teamCard
            );
        }
    );


    document
        .querySelectorAll(".add-score")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.team
                        );


                    changeScore(
                        index,
                        currentQuestionValue
                    );
                }
            );
        });


    document
        .querySelectorAll(".subtract-score")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.team
                        );


                    changeScore(
                        index,
                        -currentQuestionValue
                    );
                }
            );
        });
}


function changeScore(teamIndex, amount) {

    teams[teamIndex].score += amount;

    const scoreElement = document.getElementById(
        `score-${teamIndex}`
    );

    scoreElement.textContent =
        teams[teamIndex].score;

    // Reiniciar animaciones anteriores

    scoreElement.classList.remove(
        "score-increase",
        "score-decrease"
    );

    void scoreElement.offsetWidth;

    // Determinar la animación correspondiente

    const animationClass = amount > 0
        ? "score-increase"
        : "score-decrease";

    // Aplicar animación

    scoreElement.classList.add(animationClass);

    // Eliminar la clase cuando termine la animación

    scoreElement.onanimationend = () => {
        scoreElement.classList.remove(animationClass);
    };

    // Guardar partida

    saveGame();
}


/* ===================================================== */
/* RONDAS */
/* ===================================================== */

function loadRound() {

    answeredQuestions =
        usedQuestions[currentRound].length;


    continueButton.classList.add(
        "hidden"
    );


    if (currentRound === 1) {

        roundTitle.textContent =
            "RONDA 1";


        createBoard(
            round1Questions,
            round1Values
        );

    } else {

        roundTitle.textContent =
            "RONDA 2";


        createBoard(
            round2Questions,
            round2Values
        );
    }


    if (
        answeredQuestions === 25
    ) {

        continueButton.classList.remove(
            "hidden"
        );
    }
}


/* ===================================================== */
/* TABLERO */
/* ===================================================== */

function createBoard(
    roundQuestions,
    values
) {

    board.innerHTML =
        "";


    roundQuestions.forEach(
        categoryData => {

            const categoryCell =
                document.createElement(
                    "div"
                );


            categoryCell.classList.add(
                "category"
            );


            categoryCell.textContent =
                categoryData.category;


            board.appendChild(
                categoryCell
            );
        }
    );


    values.forEach(value => {

        roundQuestions.forEach(
            (
                categoryData,
                categoryIndex
            ) => {

                const cell =
                    document.createElement(
                        "div"
                    );


                cell.classList.add(
                    "question-cell"
                );


                cell.textContent =
                    value;


                const questionId =
                    `${categoryIndex}-${value}`;


                cell.dataset.questionId =
                    questionId;


                if (
                    usedQuestions[
                        currentRound
                    ].includes(
                        questionId
                    )
                ) {

                    markCellAsUsed(
                        cell
                    );
                }


                cell.addEventListener(
                    "click",
                    () => {

                        if (
                            cell.classList.contains(
                                "used"
                            )
                        ) {

                            return;
                        }


                        currentQuestionValue =
                            value;


                        const question =
                            categoryData.questions.find(
                                q =>
                                    q.value ===
                                    value
                            );


                        selectedCell =
                            cell;


                        currentQuestion =
                            question;


                        saveGame();


                        openQuestion(
                            categoryData.category,
                            question
                        );
                    }
                );


                board.appendChild(
                    cell
                );
            }
        );
    });
}


/* ===================================================== */
/* CASILLA USADA */
/* ===================================================== */

function markCellAsUsed(cell) {

    cell.classList.add(
        "used"
    );


    cell.textContent =
        "";


    cell.style.pointerEvents =
        "none";


    cell.style.background =
        "#11187e";
}


/* ===================================================== */
/* LIMPIAR PANTALLA MULTIMEDIA */
/* ===================================================== */

function resetQuestionMedia() {

    questionText.classList.add(
        "hidden"
    );

    questionImage.classList.add(
        "hidden"
    );

    questionAudioContainer.classList.add(
        "hidden"
    );


    answerText.classList.add(
        "hidden"
    );

    answerImage.classList.add(
        "hidden"
    );


    questionText.textContent =
        "";

    questionImage.src =
        "";

    answerText.textContent =
        "";

    answerImage.src =
        "";


    questionAudio.pause();

    questionAudio.currentTime =
        0;

    questionAudio.src =
        "";


    playAudioButton.textContent =
        "▶ REPRODUCIR AUDIO";
}


/* ===================================================== */
/* PREGUNTA MULTIMEDIA */
/* ===================================================== */

function openQuestion(
    category,
    question
) {
    playSound("question");
    resetQuestionMedia();


    questionCategory.textContent =
        category;


    questionValue.textContent =
        `${question.value} PUNTOS`;


    /* PREGUNTA DE TEXTO */

    if (
        question.questionType ===
        "text"
    ) {

        questionText.textContent =
            question.question;


        questionText.classList.remove(
            "hidden"
        );
    }


    /* PREGUNTA DE IMAGEN */

    else if (
        question.questionType ===
        "image"
    ) {

        questionImage.src =
            question.question;


        questionImage.classList.remove(
            "hidden"
        );
    }


    /* PREGUNTA DE AUDIO */

    else if (
        question.questionType ===
        "audio"
    ) {

        questionAudio.src =
            question.question;


        questionAudioContainer.classList.remove(
            "hidden"
        );
    }


    answerContainer.classList.add(
        "hidden"
    );


    showAnswerButton.classList.remove(
        "hidden"
    );


    returnBoardButton.classList.add(
        "hidden"
    );


    showScreen(
        questionScreen
    );
}


/* ===================================================== */
/* AUDIO */
/* ===================================================== */

playAudioButton.addEventListener(
    "click",
    () => {

        if (
            questionAudio.paused
        ) {

            questionAudio.currentTime =
                0;


            questionAudio.play();


            playAudioButton.textContent =
                "↻ REPRODUCIR DE NUEVO";

        } else {

            questionAudio.currentTime =
                0;
        }
    }
);


/* ===================================================== */
/* MOSTRAR RESPUESTA */
/* ===================================================== */

showAnswerButton.addEventListener(
    "click",
    () => {

        questionAudio.pause();
        playSound("reveal");

        answerContainer.classList.remove(
            "hidden"
        );


        if (
            currentQuestion.answerType ===
            "text"
        ) {

            answerText.textContent =
                currentQuestion.answer;


            answerText.classList.remove(
                "hidden"
            );
        }


        else if (
            currentQuestion.answerType ===
            "image"
        ) {

            answerImage.src =
                currentQuestion.answer;


            answerImage.classList.remove(
                "hidden"
            );
        }


        showAnswerButton.classList.add(
            "hidden"
        );


        returnBoardButton.classList.remove(
            "hidden"
        );
    }
);


/* ===================================================== */
/* VOLVER */
/* ===================================================== */

returnBoardButton.addEventListener(
    "click",
    () => {

        questionAudio.pause();

        questionAudio.currentTime =
            0;


        if (
            selectedCell &&
            !selectedCell.classList.contains(
                "used"
            )
        ) {

            const questionId =
                selectedCell.dataset.questionId;


            if (
                !usedQuestions[
                    currentRound
                ].includes(
                    questionId
                )
            ) {

                usedQuestions[
                    currentRound
                ].push(
                    questionId
                );
            }


            markCellAsUsed(
                selectedCell
            );


            answeredQuestions =
                usedQuestions[
                    currentRound
                ].length;


            saveGame();
        }


        selectedCell =
            null;

        currentQuestion =
            null;


        if (
            answeredQuestions === 25
        ) {

            continueButton.classList.remove(
                "hidden"
            );
        }


        showScreen(
            gameScreen
        );
    }
);


/* ===================================================== */
/* FIN DE RONDA */
/* ===================================================== */

continueButton.addEventListener(
    "click",
    () => {

        showRoundSummary();
    }
);


function showRoundSummary() {
    playSound("roundEnd");

    renderRanking(summaryScores);

    if (currentRound === 1) {

        summaryTitle.textContent =
            "FIN DE LA RONDA 1";

        nextRoundButton.textContent =
            "IR A RONDA 2";

    } else {

        summaryTitle.textContent =
            "FIN DE LA RONDA 2";

        nextRoundButton.textContent =
            "VER RESULTADOS";
    }

    showScreen(roundSummaryScreen);
}


/* ===================================================== */
/* SIGUIENTE RONDA */
/* ===================================================== */

nextRoundButton.addEventListener(
    "click",
    () => {

        if (
            currentRound === 1
        ) {
            playSound("click");
            currentRound = 2;

            currentQuestionValue =
                200;


            answeredQuestions =
                usedQuestions[2].length;


            saveGame();


            createScoreboard();

            loadRound();


            showScreen(
                gameScreen
            );

        } else {

            showFinalResults();
        }
    }
);


/* ===================================================== */
/* RESULTADOS */
/* ===================================================== */

function showFinalResults() {

    const winners = renderRanking(
        finalScores,
        true
    );

    const finalTitle =
        document.getElementById("finalTitle");

    if (winners.length > 1) {

        finalTitle.textContent =
            "¡TENEMOS UN EMPATE!";

    } else {

        finalTitle.textContent =
            "¡TENEMOS GANADOR!";
    }

    clearSavedGame();

    showScreen(finalScreen);

    launchConfetti();
    playSound("victory");
}


/* ===================================================== */
/* NUEVA PARTIDA */
/* ===================================================== */

newGameButton.addEventListener(
    "click",
    () => {

        clearSavedGame();

        location.reload();
    }
);


/* ===================================================== */
/* REINICIAR */
/* ===================================================== */

resetButton.addEventListener(
    "click",
    () => {

        const confirmation =
            confirm(
                "¿Seguro que quieres reiniciar la partida? Se perderá el progreso actual."
            );


        if (!confirmation) {
            return;
        }


        clearSavedGame();

        location.reload();
    }
);


/* ===================================================== */
/* INICIO */
/* ===================================================== */

updateResumeButton();
/* ===================================================== */
/* ANIMACIÓN DEL REPRODUCTOR DE AUDIO                    */
/* ===================================================== */

questionAudio.addEventListener("playing", () => {

    questionAudioContainer.classList.add("playing");

});

questionAudio.addEventListener("pause", () => {

    questionAudioContainer.classList.remove("playing");

});

questionAudio.addEventListener("ended", () => {

    questionAudioContainer.classList.remove("playing");

});

questionAudio.addEventListener("emptied", () => {

    questionAudioContainer.classList.remove("playing");

});
/* ===================================================== */
/* GENERAR CLASIFICACIÓN DE EQUIPOS                      */
/* ===================================================== */

function renderRanking(container, isFinal = false) {

    container.innerHTML = "";

    // Ordenar sin modificar el arreglo original

    const ranking = teams.map((team, index) => ({
        ...team,
        originalIndex: index
    })).sort((a, b) => b.score - a.score);

    const highestScore = ranking[0]?.score;

    const winners = ranking.filter(
        team => team.score === highestScore
    );

    container.classList.toggle(
        "multiple-winners",
        isFinal && winners.length > 1
    );

    let position = 1;

    ranking.forEach((team, index) => {

        // Los equipos empatados comparten posición

        if (
            index > 0 &&
            team.score !== ranking[index - 1].score
        ) {
            position = index + 1;
        }

        const teamRow = document.createElement("div");

        teamRow.classList.add("summary-team");

        // Conservar el color original del equipo

        teamRow.style.setProperty(
            "--team-color",
            `var(--team-${team.originalIndex + 1})`
        );

        // Destacar primer lugar

        if (team.score === highestScore) {

            teamRow.classList.add("leader");

            if (isFinal) {
                teamRow.classList.add("winner");
            }
        }

        teamRow.innerHTML = `
            <div class="summary-team-info">

                <span class="rank-number">
                    ${position}
                </span>

                <span class="summary-name"></span>

            </div>

            <span class="summary-score"></span>
        `;

        teamRow.querySelector(
            ".summary-name"
        ).textContent = team.name;

        teamRow.querySelector(
            ".summary-score"
        ).textContent = team.score.toLocaleString("es-MX");

        container.appendChild(teamRow);
    });

    return winners;
}
/* ===================================================== */
/* CONFETI DE CELEBRACIÓN                                */
/* ===================================================== */

function launchConfetti() {

    const container =
        document.getElementById("confettiContainer");

    container.innerHTML = "";

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        return;
    }

    const colors = [
        "#A979A9",
        "#C69BC4",
        "#DFC3DF",
        "#FFFFFF",
        "#CE92AD",
        "#9393C5",
        "#A68CBF"
    ];

    for (let i = 0; i < 120; i++) {

        const piece =
            document.createElement("div");

        piece.classList.add("confetti-piece");

        piece.style.left =
            `${Math.random() * 100}%`;

        piece.style.backgroundColor =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        piece.style.width =
            `${6 + Math.random() * 8}px`;

        piece.style.height =
            `${10 + Math.random() * 12}px`;

        piece.style.animationDuration =
            `${3 + Math.random() * 4}s`;

        piece.style.animationDelay =
            `${Math.random() * 3}s`;

        piece.style.setProperty(
            "--drift",
            `${Math.random() * 300 - 150}px`
        );

        piece.style.setProperty(
            "--rotation",
            `${Math.random() * 1440 - 720}deg`
        );

        if (Math.random() > 0.7) {
            piece.style.borderRadius = "50%";
        }

        piece.addEventListener(
            "animationend",
            () => piece.remove(),
            { once: true }
        );

        container.appendChild(piece);
    }
}
/* ===================================================== */
/* SISTEMA DE EFECTOS DE SONIDO                          */
/* ===================================================== */

const soundToggle =
    document.getElementById("soundToggle");

const soundIcon =
    document.getElementById("soundIcon");


let soundMuted =
    localStorage.getItem("jeopardySoundMuted") === "true";


let currentSound = null;


/* ARCHIVOS DE AUDIO */

const soundEffects = {

    click: new Audio(
        "assets/audio/sfx/click.mp3"
    ),

    question: new Audio(
        "assets/audio/sfx/question.wav"
    ),

    reveal: new Audio(
        "assets/audio/sfx/reveal.wav"
    ),

    roundEnd: new Audio(
        "assets/audio/sfx/round-end.mp3"
    ),

    victory: new Audio(
        "assets/audio/sfx/victory.mp3"
    )
};


/* VOLUMEN INDIVIDUAL */

soundEffects.click.volume = 0.30;

soundEffects.question.volume = 0.50;

soundEffects.reveal.volume = 0.50;

soundEffects.roundEnd.volume = 0.60;

soundEffects.victory.volume = 0.70;


/* PRECARGAR SONIDOS */

Object.values(soundEffects).forEach(sound => {

    sound.preload = "auto";

});


/* REPRODUCIR EFECTO */

function playSound(soundName) {

    if (soundMuted) {
        return;
    }

    const sound = soundEffects[soundName];

    if (!sound) {
        return;
    }

    // Evitar que se acumulen los sonidos

    if (currentSound) {

        currentSound.pause();
        currentSound.currentTime = 0;
    }

    currentSound = sound;

    sound.currentTime = 0;

    sound.play().catch(error => {

        console.warn(
            "No se pudo reproducir el efecto:",
            soundName,
            error
        );

    });
}


/* ACTUALIZAR BOTÓN */

function updateSoundButton() {

    soundIcon.textContent =
        soundMuted ? "🔇" : "🔊";

    soundToggle.classList.toggle(
        "muted",
        soundMuted
    );

    soundToggle.title =
        soundMuted
            ? "Activar efectos"
            : "Silenciar efectos";

    soundToggle.setAttribute(
        "aria-label",
        soundToggle.title
    );

    soundToggle.setAttribute(
        "aria-pressed",
        String(soundMuted)
    );
}


/* ACTIVAR O SILENCIAR */

soundToggle.addEventListener("click", () => {

    soundMuted = !soundMuted;

    localStorage.setItem(
        "jeopardySoundMuted",
        String(soundMuted)
    );

    if (soundMuted && currentSound) {

        currentSound.pause();
        currentSound.currentTime = 0;

        currentSound = null;
    }

    updateSoundButton();

    if (!soundMuted) {

        playSound("click");

    }
});


/* CARGAR PREFERENCIA */

updateSoundButton();
/* SONIDO GENERAL DE BOTONES */

document.addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button || button.disabled) {
        return;
    }

    if (
        button.matches(
            "#soundToggle, " +
            "#showAnswerButton, " +
            "#continueButton, " +
            "#nextRoundButton, " +
            "#playAudioButton, " +
            ".add-score, " +
            ".subtract-score"
        )
    ) {
        return;
    }

    playSound("click");

});