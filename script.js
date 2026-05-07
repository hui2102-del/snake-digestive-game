
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];

let apple = {
    x: Math.floor(Math.random() * (tileCount - 1)),
    y: Math.floor(Math.random() * (tileCount - 1)),
    size: 1.0
};

let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;

let score = 0;
let gameRunning = false;
let gameOver = false;
let timeLeft = 60;
let gameStarted = false;

// DOM Elements
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const appleSizeDisplay = document.getElementById('appleSize');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');

// Event Listeners
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    const key = e.key.toLowerCase();

    if (key === ' ') {
        e.preventDefault();
        if (!gameStarted || gameOver) {
            startGame();
        }
        return;
    }

    if (gameRunning) {
        if (key === 'w' && dy !== 1) {
            nextDx = 0;
            nextDy = -1;
        } else if (key === 's' && dy !== -1) {
            nextDx = 0;
            nextDy = 1;
        } else if (key === 'a' && dx !== 1) {
            nextDx = -1;
            nextDy = 0;
        } else if (key === 'd' && dx !== -1) {
            nextDx = 1;
            nextDy = 0;
        }
    }
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    nextDx = 0;
    nextDy = 0;
    score = 0;
    timeLeft = 60;
    gameRunning = true;
    gameOver = false;
    gameStarted = true;
    apple = {
        x: Math.floor(Math.random() * (tileCount - 1)),
        y: Math.floor(Math.random() * (tileCount - 1)),
        size: 1.0
    };

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    updateDisplay();
    startTimer();
    gameLoop();
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (gameRunning) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }
    }, 1000);
}

function gameLoop() {
    if (!gameRunning) return;

    // Only update if the snake is actually moving
    if (nextDx !== 0 || nextDy !== 0) {
        update();
    }

    draw();

    setTimeout(gameLoop, 100);
}

function update() {
    dx = nextDx;
    dy = nextDy;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check apple collision
    if (head.x === apple.x && head.y === apple.y) {
        score += 2;
        apple.size += 0.5;
        appleSizeDisplay.textContent = apple.size.toFixed(1);
        updateDisplay();

        // Add segments to snake based on apple size
        const newSegmentsCount = Math.floor(apple.size);
        for (let i = 0; i < newSegmentsCount; i++) {
            snake.push({*

