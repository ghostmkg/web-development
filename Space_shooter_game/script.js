const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverText = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let spaceship = {
    x: canvas.width / 2 - 25, y: canvas.height - 70, // Position
    displayWidth: 50, displayHeight: 50, // How large the image is drawn
    collisionWidth: 20, collisionHeight: 30, // Tighter hitbox
    collisionOffsetX: 15, collisionOffsetY: 10, // Offset to center tighter hitbox
    speed: 20 // This will now be the 'step distance' per key press
};
let lasers = [];
let enemies = [];
let explosions = [];
let score = 0;
let isGameOver = false;
let laserInterval;

// --- REMOVE leftKeyPressed and rightKeyPressed from here ---
// let leftKeyPressed = false;
// let rightKeyPressed = false;
// --- END REMOVAL ---

// Image assets
const spaceshipImg = new Image();
spaceshipImg.src = 'images/spaceship.png';
const enemyImg = new Image();
enemyImg.src = 'images/enemy.png';
const laserImg = new Image();
laserImg.src = 'images/laser.png';
const explosionImg = new Image();
explosionImg.src = 'images/explosion.png';


// --- ALL HELPER FUNCTIONS DEFINED HERE (BEFORE gameLoop) ---

// --- The moveSpaceship function is no longer needed in its current form for discrete movement ---
/*
function moveSpaceship() {
    // This function will be empty or removed if movement is handled in keydown
}
*/

// Draw spaceship using an image and rotate it
function drawSpaceship() {
    ctx.save();
    ctx.translate(spaceship.x + spaceship.displayWidth / 2, spaceship.y + spaceship.displayHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(spaceshipImg, -spaceship.displayWidth / 2, -spaceship.displayHeight / 2, spaceship.displayWidth, spaceship.displayHeight);
    ctx.restore();

    // OPTIONAL: Draw hitbox for debugging
    // ctx.strokeStyle = 'cyan';
    // ctx.strokeRect(spaceship.x + spaceship.collisionOffsetX, spaceship.y + spaceship.collisionOffsetY, spaceship.collisionWidth, spaceship.collisionHeight);
}

// Handle laser shooting automatically
function autoShootLaser() {
    lasers.push({
        x: spaceship.x + spaceship.displayWidth / 2 - 5, y: spaceship.y - 10,
        displayWidth: 10, displayHeight: 20,
        collisionWidth: 4, collisionHeight: 10,
        collisionOffsetX: 3, collisionOffsetY: 5,
        speed: 3
    });
}

// Draw lasers with image
function drawLasers() {
    lasers.forEach((laser, index) => {
        laser.y -= laser.speed;
        if (laser.y < -laser.displayHeight) {
            lasers.splice(index, 1);
        }
        ctx.drawImage(laserImg, laser.x, laser.y, laser.displayWidth, laser.displayHeight);

        // OPTIONAL: Draw hitbox for debugging
        // ctx.strokeStyle = 'yellow';
        // ctx.strokeRect(laser.x + laser.collisionOffsetX, laser.y + laser.collisionOffsetY, laser.collisionWidth, laser.collisionHeight);
    });
}

// Generate enemies
function generateEnemies() {
    if (Math.random() < 0.025) {
        const enemyDisplayWidth = 60;
        const enemyDisplayHeight = 60;

        enemies.push({
            x: Math.random() * (canvas.width - enemyDisplayWidth),
            y: -enemyDisplayHeight,
            displayWidth: enemyDisplayWidth, displayHeight: enemyDisplayHeight,
            collisionWidth: 30, collisionHeight: 30,
            collisionOffsetX: 15, collisionOffsetY: 15,
            speed: 1 + Math.random() * 1,
        });
    }
}

// Draw enemies with image
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.displayWidth, enemy.displayHeight);

        // OPTIONAL: Draw hitbox for debugging
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(enemy.x + enemy.collisionOffsetX, enemy.y + enemy.collisionOffsetY, enemy.collisionWidth, enemy.collisionHeight);
    });
}

// Create explosion effect
function createExplosion(x, y) {
    explosions.push({ x, y, size: 50, frame: 0, maxFrame: 5 });
}

// Draw explosion effect
function drawExplosions() {
    explosions.forEach((explosion, index) => {
        ctx.drawImage(explosionImg, explosion.x - explosion.size / 2, explosion.y - explosion.size / 2, explosion.size, explosion.size);
        explosion.frame++;
        if (explosion.frame > explosion.maxFrame) {
            explosions.splice(index, 1);
        }
    });
}

// Check for collisions
function checkCollisions() {
    lasers.forEach((laser, laserIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const laserHitboxX = laser.x + laser.collisionOffsetX;
            const laserHitboxY = laser.y + laser.collisionOffsetY;
            const enemyHitboxX = enemy.x + enemy.collisionOffsetX;
            const enemyHitboxY = enemy.y + enemy.collisionOffsetY;

            if (
                laserHitboxX < enemyHitboxX + enemy.collisionWidth &&
                laserHitboxX + laser.collisionWidth > enemyHitboxX &&
                laserHitboxY < enemyHitboxY + enemy.collisionHeight &&
                laserHitboxY + laser.collisionHeight > enemyHitboxY
            ) {
                createExplosion(enemy.x + enemy.displayWidth / 2, enemy.y + enemy.displayHeight / 2);
                enemies.splice(enemyIndex, 1);
                lasers.splice(laserIndex, 1);
                score++;
            }
        });
    });

    enemies.forEach((enemy, enemyIndex) => {
        const spaceshipHitboxX = spaceship.x + spaceship.collisionOffsetX;
        const spaceshipHitboxY = spaceship.y + spaceship.collisionOffsetY;
        const enemyHitboxX = enemy.x + enemy.collisionOffsetX;
        const enemyHitboxY = enemy.y + enemy.collisionOffsetY;

        if (
            spaceshipHitboxX < enemyHitboxX + enemy.collisionWidth &&
            spaceshipHitboxX + spaceship.collisionWidth > enemyHitboxX &&
            spaceshipHitboxY < enemyHitboxY + enemy.collisionHeight &&
            spaceshipHitboxY + spaceship.collisionHeight > enemyHitboxY
        ) {
            createExplosion(spaceship.x + spaceship.displayWidth / 2, spaceship.y + spaceship.displayHeight / 2);
            isGameOver = true;
            gameOver();
        }
    });
}

// Game over
function gameOver() {
    gameOverText.style.display = 'block';
    clearInterval(laserInterval);
}

// Restart game
function restartGame() {
    isGameOver = false;
    score = 0;
    enemies = [];
    lasers = [];
    explosions = [];
    gameOverText.style.display = 'none';
    laserInterval = setInterval(autoShootLaser, 600);
    gameLoop();
}

// Update score
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}
// --- END OF HELPER FUNCTIONS ---


// --- gameLoop function definition ---
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // --- moveSpaceship() is no longer called here ---
    drawSpaceship();
    drawLasers();
    drawEnemies();
    drawExplosions();
    checkCollisions();
    generateEnemies();
    updateScore();

    requestAnimationFrame(gameLoop);
}
// --- End of gameLoop function definition ---


// Ensure all images are loaded before starting the game
let imagesLoaded = 0;
const totalImages = 4;

function imageLoadHandler() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        laserInterval = setInterval(autoShootLaser, 600);
        gameLoop();
    }
}

// Assign onload handlers AFTER imageLoadHandler is defined
spaceshipImg.onload = imageLoadHandler;
enemyImg.onload = imageLoadHandler;
laserImg.onload = imageLoadHandler;
explosionImg.onload = imageLoadHandler;


// --- IMPORTANT: Event Listeners for discrete movement ---
document.addEventListener('keydown', (e) => {
    if (isGameOver) { // Only allow restart if game is over
        if (e.key === ' ') {
            restartGame();
        }
        return; // Don't process other keys if game is over
    }

    // Discrete movement based on key press
    if (e.key === 'ArrowLeft') {
        // Move left by 'speed' amount, ensuring it stays within bounds
        spaceship.x = Math.max(0, spaceship.x - spaceship.speed);
    } else if (e.key === 'ArrowRight') {
        // Move right by 'speed' amount, ensuring it stays within bounds
        spaceship.x = Math.min(canvas.width - spaceship.displayWidth, spaceship.x + spaceship.speed);
    }
    // No 'keyup' listener needed for discrete movement
});