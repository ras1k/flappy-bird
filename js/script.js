const gameContainer = document.getElementById('gameContainer');
const bird = document.getElementById('bird');
const scoreDisplay = document.getElementById('score');
const speedSlider = document.getElementById('speedSlider');
const crashSound = document.getElementById('crashSound'); // Reference to crash sound
const gameOverSound = document.getElementById('gameOverSound'); // Reference to game over sound
const passSound = document.getElementById('passSound');

const gravity = 0.5; // Gravity effect
let birdVelocity = 0; // Bird's vertical speed
const jumpPower = -8; // Jumping force
const pipeGap = 200; // Gap between pipes
const pipeSpeed = 3; // Speed at which pipes move
const pipeInterval = 2000; // Time between pipes in ms

const pipes = []; // Array to keep track of pipes
let score = 0; // Game score

const startGame = () => {
    bird.style.left = '10%';
    bird.style.top = '50%';
    birdVelocity = 0;

    const gameLoop = setInterval(() => {
        birdVelocity += gravity;
        const newTop = parseFloat(bird.style.top) + birdVelocity;

        if (newTop > gameContainer.clientHeight - bird.clientHeight) {
            crashSound.play(); // Play crash sound on collision with ground
            endGame(gameLoop);
            return;
        }

        if (newTop < 0) {
            crashSound.play(); // Play crash sound on collision with top edge
            endGame(gameLoop);
            return;
        }

        bird.style.top = `${newTop}px`;

        updatePipes(gameLoop);
    }, 20);

    generatePipes();
};

const endGame = (gameLoop) => {
    clearInterval(gameLoop); // Stop the game loop
    gameOverSound.play(); // Play game over sound
    alert('Game Over! Final Score: ' + score);
    location.reload(); // Reload the game to restart
};

const jump = () => {
    birdVelocity = jumpPower;
};

const generatePipes = () => {
    setInterval(() => {
        const pipeHeight = Math.random() * (gameContainer.clientHeight - pipeGap * 2) + pipeGap;
        const pipeTop = document.createElement('div');
        pipeTop.className = 'pipe pipe-top';
        pipeTop.style.height = `${pipeHeight}px`;
        pipeTop.style.right = `-60px`;

        const pipeBottom = document.createElement('div');
        pipeBottom.className = 'pipe pipe-bottom';
        pipeBottom.style.height = `${gameContainer.clientHeight - pipeGap - pipeHeight}px`;
        pipeBottom.style.right = `-60px`;

        gameContainer.appendChild(pipeTop);
        gameContainer.appendChild(pipeBottom);

        pipes.push({ top: pipeTop, bottom: pipeBottom });
    }, pipeInterval);
};

const updatePipes = (gameLoop) => {
    pipes.forEach(pipe => {
        const pipeRight = parseFloat(pipe.top.style.right) + pipeSpeed;
        pipe.top.style.right = `${pipeRight}px`;
        pipe.bottom.style.right = `${pipeRight}px`;

        if (pipeRight > gameContainer.clientWidth) {
            gameContainer.removeChild(pipe.top);
            gameContainer.removeChild(pipe.bottom)
            pipes.shift(); // Remove pipe from array
            score += 10; // Increment score when pipes are cleared
            passSound.play();
            scoreDisplay.textContent = `Score: ${score}`;
        }

        const birdRect = bird.getBoundingClientRect();
        const topRect = pipe.top.getBoundingClientRect();
        const bottomRect = pipe.bottom.getBoundingClientRect();

            if ((birdRect.right > topRect.left &&
                birdRect.left < topRect.right &&
                (birdRect.top < topRect.bottom ||
                birdRect.bottom > bottomRect.top)) ||
            birdRect.left > gameContainer.clientWidth) {
            crashSound.play(); // Play crash sound when bird hits a pipe
            endGame(gameLoop);
        }
    });
};

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.keyCode === 32) {
        jump();
    }
});

speedSlider.addEventListener('input', (event) => {
    pipeSpeed = parseFloat(event.target.value);
});

startGame();