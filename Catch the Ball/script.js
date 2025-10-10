const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
let score = 0;

// Ball movement settings
let ballX = 290; // Starting x position
let ballY = 20; // Starting y position
let ballSpeedX = 2;
let ballSpeedY = 3;

// Paddle movement settings
let paddleX = 250; // Starting paddle position
const paddleWidth = 100;

// Update the game state every 16 milliseconds (~60fps)
function gameLoop() {
  // Move the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with walls
  if (ballX <= 0 || ballX + 20 >= 600) {
    // Wall boundaries
    ballSpeedX = -ballSpeedX;
  }
  if (ballY <= 0) {
    // Top boundary
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with paddle
  if (
    ballY + 20 >= 380 &&
    ballX + 20 >= paddleX &&
    ballX <= paddleX + paddleWidth
  ) {
    ballSpeedY = -ballSpeedY;
    score++;
    scoreDisplay.textContent = score;
  }

  // Ball missed the paddle
  if (ballY > 400) {
    alert(`Game Over! Your final score is ${score}`);
    score = 0;
    scoreDisplay.textContent = score;
    ballX = 290;
    ballY = 20;
    ballSpeedX = 2;
    ballSpeedY = 3;
  }

  // Update ball position
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  requestAnimationFrame(gameLoop);
}

// Control paddle movement with arrow keys
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && paddleX > 0) {
    paddleX -= 20;
  } else if (e.key === "ArrowRight" && paddleX < 500) {
    paddleX += 20;
  }
  paddle.style.left = paddleX + "px";
});

// Start the game loop
gameLoop();
