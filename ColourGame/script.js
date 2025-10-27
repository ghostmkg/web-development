const boxesContainer = document.getElementById('boxesContainer');
const targetColorText = document.getElementById('targetColor');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

let colors = [];
let targetColor;

function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function setupGame() {
    colors = [];
    boxesContainer.innerHTML = '';
    message.textContent = '';

    // create 6 color boxes
    for (let i = 0; i < 6; i++) {
        const color = randomColor();
        colors.push(color);

        const box = document.createElement('div');
        box.className = 'colorBox';
        box.style.backgroundColor = color;

        box.addEventListener('click', () => checkColor(color));
        boxesContainer.appendChild(box);
    }

    targetColor = colors[Math.floor(Math.random() * colors.length)];
    targetColorText.textContent = targetColor.toUpperCase();
}

function checkColor(color) {
    if (color === targetColor) {
        message.textContent = 'Correct!';
        // change all boxes to target color
        document.querySelectorAll('.colorBox').forEach(box => {
            box.style.backgroundColor = targetColor;
        });
    } else {
        message.textContent = 'Try Again!';
    }
}

resetBtn.addEventListener('click', setupGame);

// start the game
setupGame();
