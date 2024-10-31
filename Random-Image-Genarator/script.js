const container = document.querySelector('.container'); // Corrected selector

const unsplashURL = 'https://unsplash.com/s/photos/random/'
const rows = 10;

for (let i = 0; i < rows * 3; i++) {
    const img = document.createElement('img');
    img.src = `${unsplashURL}${getRandomSize()}`;
    container.appendChild(img);
}

function getRandomSize() {
    return `${getRandomNr()}x${getRandomNr()}`;
}

function getRandomNr() {
    return Math.floor(Math.random() * 10) + 300; // Fixed Math.random() function call
}
