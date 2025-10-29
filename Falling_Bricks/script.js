const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gameOver = false;

const player = {
  x: 180,
  y: 550,
  width: 40,
  height: 20,
  speed: 7,
  moveLeft: false,
  moveRight: false,
};

const blocks = [];
function spawnBlock() {
  blocks.push({
    x: Math.random() * (canvas.width - 20),
    y: 0,
    size: 20,
    speed: 3 + Math.random() * 3,
  });
}

function update() {
  if (gameOver) return;
  if (player.moveLeft && player.x > 0) player.x -= player.speed;
  if (player.moveRight && player.x < canvas.width - player.width)
    player.x += player.speed;

  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    b.y += b.speed;
    if (
      b.y + b.size >= player.y &&
      b.x + b.size >= player.x &&
      b.x <= player.x + player.width
    ) {
      score++;
      blocks.splice(i, 1);
    } else if (b.y > canvas.height) {
      gameOver = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "skyblue";
  for (const b of blocks) ctx.fillRect(b.x, b.y, b.size, b.size);
  ctx.fillStyle = "yellow";
  ctx.fillText("Score: " + score, 10, 20);
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 130, 300);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.moveLeft = true;
  if (e.key === "ArrowRight") player.moveRight = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") player.moveLeft = false;
  if (e.key === "ArrowRight") player.moveRight = false;
});

setInterval(() => {
  if (!gameOver) spawnBlock();
}, 800);

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
