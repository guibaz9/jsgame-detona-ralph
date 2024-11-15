const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector(".menu-lives h2"),
        startButton: document.createElement("button"),
        difficultySelector: document.createElement("select"),
        menu: document.createElement("div"), // Menu de seleção
    },
    values: {
        timerId: null,
        countDownTimerId: null,
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
        difficulty: "medium", // Dificuldade padrão
    },
    difficulties: {
        easy: { gameVelocity: 1500, currentTime: 90 },
        medium: { gameVelocity: 1000, currentTime: 60 },
        hard: { gameVelocity: 700, currentTime: 45 },
        impossible: { gameVelocity: 400, currentTime: 30 },
    },
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        clearInterval(state.values.countDownTimerId);
        clearInterval(state.values.timerId);
        alert("GAME OVER! O seu resultado foi: " + state.values.result);
        endGame();
    }
}

function playSound() {
    let audio = new Audio("./src/audios/hit.m4a");
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        const newSquare = square.cloneNode(true);
        square.parentNode.replaceChild(newSquare, square);

        newSquare.addEventListener("mousedown", () => {
            if (newSquare.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound();
            } else {
                state.values.lives--;
                state.view.lives.textContent = `x${state.values.lives}`;
                if (state.values.lives <= 0) {
                    clearInterval(state.values.countDownTimerId);
                    clearInterval(state.values.timerId);
                    alert("GAME OVER! Você perdeu todas as vidas!");
                    endGame();
                }
            }
        });
    });

    state.view.squares = document.querySelectorAll(".square");
}

function endGame() {
    clearInterval(state.values.timerId);
    clearInterval(state.values.countDownTimerId);
    state.view.menu.style.display = "flex"; // Mostrar menu de início
}

function initialize() {
    // Aplicar configuração baseada na dificuldade selecionada
    const selectedDifficulty = state.difficulties[state.values.difficulty];
    state.values.gameVelocity = selectedDifficulty.gameVelocity;
    state.values.currentTime = selectedDifficulty.currentTime;
    state.values.result = 0;
    state.values.lives = 3;

    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = `x${state.values.lives}`;

    moveEnemy();
    state.values.countDownTimerId = setInterval(countDown, 1000);
    addListenerHitBox();

    // Esconder menu
    state.view.menu.style.display = "none";
}

// Configurar menu de dificuldade e botão "Start"
state.view.menu.className = "menu-start";
state.view.difficultySelector.className = "difficulty-selector";
["easy", "medium", "hard", "impossible"].forEach((difficulty) => {
    const option = document.createElement("option");
    option.value = difficulty;
    option.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    state.view.difficultySelector.appendChild(option);
});
state.view.difficultySelector.addEventListener("change", (e) => {
    state.values.difficulty = e.target.value;
});

state.view.startButton.textContent = "Start";
state.view.startButton.className = "start-button";
state.view.startButton.addEventListener("click", initialize);

state.view.menu.appendChild(state.view.difficultySelector);
state.view.menu.appendChild(state.view.startButton);
document.body.appendChild(state.view.menu);
