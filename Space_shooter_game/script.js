const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverText = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let spaceship = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50, speed: 10 };
let lasers = [];
let enemies = [];
let explosions = []; // Store explosion coordinates
let score = 0;
let isGameOver = false;
let laserInterval;  // This will hold the interval ID for automatic shooting
let leftKeyPressed = false;
let rightKeyPressed = false;

// Handle spaceship movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        leftKeyPressed = true;
    } else if (e.key === 'ArrowRight') {
        rightKeyPressed = true;
    } else if (e.key === ' ' && isGameOver) {
        restartGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        leftKeyPressed = false;
    } else if (e.key === 'ArrowRight') {
        rightKeyPressed = false;
    }
});

// Move spaceship smoothly
function moveSpaceship() {
    if (leftKeyPressed && spaceship.x > 0) {
        spaceship.x -= spaceship.speed;
    }
    if (rightKeyPressed && spaceship.x + spaceship.width < canvas.width) {
        spaceship.x += spaceship.speed;
    }
}

// Draw spaceship
function drawSpaceship() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// Handle laser shooting automatically
function autoShootLaser() {
    lasers.push({ x: spaceship.x + spaceship.width / 2 - 2, y: spaceship.y, width: 4, height: 10, speed: 5 });
}

// Draw lasers with glow effect
function drawLasers() {
    lasers.forEach((laser, index) => {
        laser.y -= laser.speed;
        if (laser.y < 0) {
            lasers.splice(index, 1);
        }
        ctx.fillStyle = 'red';
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
        ctx.shadowBlur = 10; // Glow effect
        ctx.shadowColor = "red";
    });
    ctx.shadowBlur = 0; // Reset shadow after laser drawing
}

// Generate enemies
function generateEnemies() {
    if (Math.random() < 0.02) {
        const enemyWidth = 40;
        const enemyHeight = 40;
        enemies.push({
            x: Math.random() * (canvas.width - enemyWidth),
            y: 0,
            width: enemyWidth,
            height: enemyHeight,
            speed: 3,
        });
    }
}

// Draw enemies with animation
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1); // Remove enemy if it goes off screen
        }
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Create explosion effect
function createExplosion(x, y) {
    explosions.push({ x, y, radius: 20 });
}

// Draw explosion effect
function drawExplosions() {
    explosions.forEach((explosion, index) => {
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'orange';
        ctx.fill();
        explosion.radius -= 1; // Shrink the explosion
        if (explosion.radius <= 0) {
            explosions.splice(index, 1); // Remove explosion when finished
        }
    });
}

// Check for collisions and create explosion on hit
function checkCollisions() {
    lasers.forEach((laser, laserIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                laser.x < enemy.x + enemy.width &&
                laser.x + laser.width > enemy.x &&
                laser.y < enemy.y + enemy.height &&
                laser.y + laser.height > enemy.y
            ) {
                // Laser hits enemy
                enemies.splice(enemyIndex, 1);
                lasers.splice(laserIndex, 1);
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2); // Create explosion
                score++;
            }
        });
    });

    enemies.forEach((enemy) => {
        if (
            spaceship.x < enemy.x + enemy.width &&
            spaceship.x + spaceship.width > enemy.x &&
            spaceship.y < enemy.y + enemy.height &&
            spaceship.y + spaceship.height > enemy.y
        ) {
            // Enemy hits spaceship
            isGameOver = true;
            gameOver();
        }
    });
}

// Game over
function gameOver() {
    gameOverText.style.display = 'block';
    clearInterval(laserInterval); // Stop shooting when game is over
}

// Restart game
function restartGame() {
    isGameOver = false;
    score = 0;
    enemies = [];
    lasers = [];
    explosions = [];
    gameOverText.style.display = 'none';
    laserInterval = setInterval(autoShootLaser, 300); // Restart automatic shooting
    gameLoop();
}

// Update score
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Main game loop
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSpaceship();
    drawSpaceship();
    drawLasers();
    drawEnemies();
    drawExplosions(); // Draw explosion effects
    checkCollisions();
    generateEnemies();
    updateScore();

    requestAnimationFrame(gameLoop);
}

// Start the automatic laser shooting and the game loop
laserInterval = setInterval(autoShootLaser, 300); // Shoots every 300 milliseconds
gameLoop();
