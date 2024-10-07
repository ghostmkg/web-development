function createSnakeGame(canvas) {
    const ctx = canvas.getContext('2d');
    let snake = [{ x: 10, y: 10 }];
    let dx = 10;
    let dy = 0;
    let food = { x: 15, y: 15 };
    let score = 0;
    let highScore = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'green';
        snake.forEach(part => {
            ctx.fillRect(part.x, part.y, 10, 10);
        });
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);
        document.getElementById('score-display').textContent = `Score: ${score}`;
        if (score > highScore) {
            highScore = score;
        }
        document.getElementById('high-score').textContent = `High Score: ${highScore}`;
    }

    function move() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }

        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver();
        }

        snake.forEach((part, index) => {
            if (index > 0 && part.x === head.x && part.y === head.y) {
                gameOver();
            }
        });
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
            y: Math.floor(Math.random() * (canvas.height / 10)) * 10,
        };
    }

    function gameOver() {
        alert(`Game Over! Your score: ${score}`);
        resetGame();
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        dx = 10;
        dy = 0;
        score = 0;
        generateFood();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -10;
        } else if (e.key === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = 10;
        } else if (e.key === 'ArrowLeft' && dx === 0) {
            dx = -10;
            dy = 0;
        } else if (e.key === 'ArrowRight' && dx === 0) {
            dx = 10;
            dy = 0;
        }
    });

    function gameLoop() {
        move();
        draw();
        setTimeout(gameLoop, 100);
    }

    generateFood();
    gameLoop();
}

const canvas = document.getElementById('game-canvas');
createSnakeGame(canvas);
