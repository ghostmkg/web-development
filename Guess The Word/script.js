const words = {
  animals: {
    easy: [
      { word: 'cat', hint: 'Small domesticated animal' },
      { word: 'dog', hint: 'Man\'s best friend' }
    ],
    medium: [
      { word: 'giraffe', hint: 'Tall animal with long neck' }
    ],
    hard: [
      { word: 'echidna', hint: 'Spiny anteater' }
    ]
  },
  tech: {
    easy: [
      { word: 'mouse', hint: 'Computer pointing device' }
    ],
    medium: [
      { word: 'laptop', hint: 'Portable computer' }
    ],
    hard: [
      { word: 'algorithm', hint: 'Step-by-step problem solver' }
    ]
  },
  food: {
    easy: [
      { word: 'rice', hint: 'Staple grain food' }
    ],
    medium: [
      { word: 'noodle', hint: 'Long, thin pasta' }
    ],
    hard: [
      { word: 'sauerkraut', hint: 'Fermented cabbage' }
    ]
  }
};

let selectedWord = '', hint = '', guessedLetters = [], wrongGuesses = [], remaining = 6, round = 1, score = 0, timer;
let hintUsed = false;

const startGameBtn = document.getElementById('startGameBtn');
const difficultySelect = document.getElementById('difficulty');
const categorySelect = document.getElementById('category');

startGameBtn.addEventListener('click', () => {
  const difficulty = difficultySelect.value;
  const category = categorySelect.value;
  startGame(category, difficulty);
});

function startGame(category, difficulty) {
  document.querySelector('.game-setup').style.display = 'none';
  document.querySelector('.game-container').style.display = 'block';

  const wordObj = words[category][difficulty][Math.floor(Math.random() * words[category][difficulty].length)];
  selectedWord = wordObj.word.toLowerCase();
  hint = wordObj.hint;

  guessedLetters = [];
  wrongGuesses = [];
  remaining = 6;
  hintUsed = false;
  document.getElementById('hintText').textContent = '???';
  document.getElementById('currentCategory').textContent = category;
  document.getElementById('wrongGuesses').textContent = '';
  document.getElementById('remaining').textContent = remaining;
  document.getElementById('score').textContent = score;
  document.getElementById('roundDisplay').textContent = `Round: ${round}`;
  document.getElementById('message').textContent = '';

  updateDisplay();
  startTimer();
}

function updateDisplay() {
  const display = selectedWord
    .split('')
    .map(letter => guessedLetters.includes(letter) ? letter : '_')
    .join(' ');
  document.getElementById('wordDisplay').textContent = display;

  if (!display.includes('_')) {
    score += 10;
    round++;
    document.getElementById('message').textContent = '🎉 Correct! Next Round...';
    clearInterval(timer);
    setTimeout(() => startGame(categorySelect.value, difficultySelect.value), 2000);
  }
}

const guessBtn = document.getElementById('guessBtn');
const letterInput = document.getElementById('letterInput');

guessBtn.addEventListener('click', () => {
  const letter = letterInput.value.toLowerCase();
  letterInput.value = '';
  if (!letter.match(/[a-z]/) || letter.length !== 1) return;

  if (selectedWord.includes(letter)) {
    if (!guessedLetters.includes(letter)) {
      guessedLetters.push(letter);
      score += 1;
    }
  } else {
    if (!wrongGuesses.includes(letter)) {
      wrongGuesses.push(letter);
      remaining--;
      score -= 1;
    }
  }
  document.getElementById('wrongGuesses').textContent = wrongGuesses.join(' ');
  document.getElementById('remaining').textContent = remaining;
  document.getElementById('score').textContent = score;

  updateDisplay();

  if (remaining === 0) {
    document.getElementById('message').textContent = `❌ Game Over! The word was "${selectedWord}"`;
    clearInterval(timer);
    saveHighScore();
  }
});

const hintBtn = document.getElementById('hintBtn');
hintBtn.addEventListener('click', () => {
  if (!hintUsed) {
    document.getElementById('hintText').textContent = hint;
    hintUsed = true;
    score -= 2;
    document.getElementById('score').textContent = score;
  }
});

function startTimer() {
  let time = 60;
  document.getElementById('timer').textContent = time;
  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    document.getElementById('timer').textContent = time;
    if (time === 0) {
      clearInterval(timer);
      document.getElementById('message').textContent = `⏰ Time's up! The word was "${selectedWord}"`;
      saveHighScore();
    }
  }, 1000);
}

function saveHighScore() {
  const scores = JSON.parse(localStorage.getItem('highScores')) || [];
  scores.push({ score, date: new Date().toLocaleDateString() });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('highScores', JSON.stringify(scores.slice(0, 5)));
  showLeaderboard();
}

function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('highScores')) || [];
  document.getElementById('highScores').innerHTML = scores
    .map(s => `<li>${s.date} - ${s.score} pts</li>`)
    .join('');
}

const restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', () => location.reload());

showLeaderboard();
