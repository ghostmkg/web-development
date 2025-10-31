// Game Configuration
const COLORS = {
    RED: 'hsl(0, 85%, 60%)',
    BLUE: 'hsl(220, 90%, 55%)',
    GREEN: 'hsl(140, 75%, 50%)',
    YELLOW: 'hsl(48, 100%, 55%)',
    PURPLE: 'hsl(270, 80%, 60%)',
    ORANGE: 'hsl(25, 95%, 60%)',
    PINK: 'hsl(330, 80%, 65%)',
    CYAN: 'hsl(180, 85%, 55%)'
};

const COLOR_NAMES = Object.keys(COLORS);
const GAME_DURATION = 60;

// Game State
let gameState = 'idle'; // idle, countdown, playing, gameOver
let score = 0;
let timeLeft = GAME_DURATION;
let currentWord = '';
let currentWordColor = '';
let buttonColors = [];
let lastWord = '';
let lastColor = '';
let timerInterval = null;
let countdownInterval = null;

// DOM Elements
const elements = {
    stats: document.getElementById('stats'),
    scoreDisplay: document.getElementById('score'),
    timerDisplay: document.getElementById('timer'),
    
    idleState: document.getElementById('idleState'),
    countdownState: document.getElementById('countdownState'),
    playingState: document.getElementById('playingState'),
    gameOverState: document.getElementById('gameOverState'),
    
    startButton: document.getElementById('startButton'),
    restartButton: document.getElementById('restartButton'),
    
    countdownNumber: document.getElementById('countdownNumber'),
    colorWord: document.getElementById('colorWord'),
    buttonGrid: document.getElementById('buttonGrid'),
    
    finalScore: document.getElementById('finalScore'),
    feedback: document.getElementById('feedback'),
    gameOverEmoji: document.getElementById('gameOverEmoji'),
    
    gameCard: document.querySelector('.game-card')
};

// Utility Functions
function getRandomColor(exclude = []) {
    const available = COLOR_NAMES.filter(c => !exclude.includes(c));
    return available[Math.floor(Math.random() * available.length)];
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showState(stateName) {
    // Hide all states
    elements.idleState.classList.remove('active');
    elements.countdownState.classList.remove('active');
    elements.playingState.classList.remove('active');
    elements.gameOverState.classList.remove('active');
    
    // Show requested state
    switch(stateName) {
        case 'idle':
            elements.idleState.classList.add('active');
            elements.stats.classList.remove('visible');
            break;
        case 'countdown':
            elements.countdownState.classList.add('active');
            elements.stats.classList.remove('visible');
            break;
        case 'playing':
            elements.playingState.classList.add('active');
            elements.stats.classList.add('visible');
            break;
        case 'gameOver':
            elements.gameOverState.classList.add('active');
            elements.stats.classList.add('visible');
            break;
    }
}

// Game Logic
function generateNewRound() {
    // Get a word different from the last one
    currentWord = getRandomColor([lastWord]);
    
    // Get a color different from both the word and the last color
    currentWordColor = getRandomColor([currentWord, lastColor]);
    
    // Generate 4 unique button colors, ensuring the correct answer is included
    buttonColors = [currentWord];
    while (buttonColors.length < 4) {
        const randomColor = getRandomColor(buttonColors);
        buttonColors.push(randomColor);
    }
    
    // Shuffle the buttons
    buttonColors = shuffleArray(buttonColors);
    
    // Update display
    elements.colorWord.textContent = currentWord;
    elements.colorWord.style.color = COLORS[currentWordColor];
    
    // Create button grid
    elements.buttonGrid.innerHTML = '';
    buttonColors.forEach((color, index) => {
        const button = document.createElement('button');
        button.className = 'color-button';
        button.textContent = color;
        button.style.backgroundColor = COLORS[color];
        button.style.animationDelay = `${index * 0.1}s`;
        button.onclick = () => handleColorClick(color);
        elements.buttonGrid.appendChild(button);
    });
    
    // Remember last colors
    lastWord = currentWord;
    lastColor = currentWordColor;
}

function handleColorClick(clickedColor) {
    if (gameState !== 'playing') return;
    
    if (clickedColor === currentWord) {
        score++;
        elements.scoreDisplay.textContent = score;
        
        // Flash animation
        elements.gameCard.classList.add('flash');
        setTimeout(() => elements.gameCard.classList.remove('flash'), 500);
    } else {
        score = Math.max(0, score - 1);
        elements.scoreDisplay.textContent = score;
    }
    
    generateNewRound();
}

function startCountdown() {
    gameState = 'countdown';
    showState('countdown');
    
    let count = 3;
    elements.countdownNumber.textContent = count;
    elements.countdownNumber.style.color = COLORS[COLOR_NAMES[count % COLOR_NAMES.length]];
    
    countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            elements.countdownNumber.textContent = count;
            elements.countdownNumber.style.color = COLORS[COLOR_NAMES[count % COLOR_NAMES.length]];
        } else {
            elements.countdownNumber.textContent = 'GO!';
            clearInterval(countdownInterval);
            setTimeout(startPlaying, 500);
        }
    }, 1000);
}

function startPlaying() {
    gameState = 'playing';
    showState('playing');
    generateNewRound();
    
    // Start game timer
    timerInterval = setInterval(() => {
        timeLeft--;
        elements.timerDisplay.textContent = `${timeLeft}s`;
        
        // Add urgent animation when time is low
        if (timeLeft <= 10) {
            elements.timerDisplay.classList.add('urgent');
        }
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    gameState = 'gameOver';
    showState('gameOver');
    
    // Update final score
    elements.finalScore.textContent = `${score} Points`;
    
    // Update emoji and feedback
    let emoji = '💪';
    let feedback = 'Nice try! Challenge yourself again! 💪';
    
    if (score >= 40) {
        emoji = '🏆';
        feedback = 'Outstanding reflexes! You\'re a color master! 🎉';
    } else if (score >= 25) {
        emoji = '⭐';
        feedback = 'Great job! Your brain is fast! ⚡';
    } else if (score >= 15) {
        emoji = '👍';
        feedback = 'Good effort! Keep practicing! 👊';
    }
    
    elements.gameOverEmoji.textContent = emoji;
    elements.feedback.textContent = feedback;
}

function startGame() {
    // Reset game state
    score = 0;
    timeLeft = GAME_DURATION;
    lastWord = '';
    lastColor = '';
    
    // Update displays
    elements.scoreDisplay.textContent = score;
    elements.timerDisplay.textContent = `${timeLeft}s`;
    elements.timerDisplay.classList.remove('urgent');
    
    // Start countdown
    startCountdown();
}

// Event Listeners
elements.startButton.addEventListener('click', startGame);
elements.restartButton.addEventListener('click', startGame);

// Initialize game
showState('idle');
