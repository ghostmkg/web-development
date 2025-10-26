const words = {
  animals: {
    easy: [
      { word: 'cat', hint: 'Small domesticated animal' },
      { word: 'dog', hint: 'Man\'s best friend' },
      { word: 'pig', hint: 'Farm animal that oinks' },
      { word: 'cow', hint: 'Animal that gives milk' },
      { word: 'bird', hint: 'Creature with feathers' }
    ],
    medium: [
      { word: 'giraffe', hint: 'Tall animal with long neck' },
      { word: 'elephant', hint: 'Large animal with trunk' },
      { word: 'kangaroo', hint: 'Animal that hops' },
      { word: 'penguin', hint: 'Bird that swims' }
    ],
    hard: [
      { word: 'echidna', hint: 'Spiny anteater' },
      { word: 'platypus', hint: 'Egg-laying mammal' },
      { word: 'narwhal', hint: 'Whale with a tusk' },
      { word: 'axolotl', hint: 'Salamander that stays aquatic' }
    ]
  },
  tech: {
    easy: [
      { word: 'mouse', hint: 'Computer pointing device' },
      { word: 'keyboard', hint: 'Input device with keys' },
      { word: 'screen', hint: 'Display output' }
    ],
    medium: [
      { word: 'laptop', hint: 'Portable computer' },
      { word: 'smartphone', hint: 'Mobile device with apps' },
      { word: 'router', hint: 'Device for internet connection' }
    ],
    hard: [
      { word: 'algorithm', hint: 'Step-by-step problem solver' },
      { word: 'blockchain', hint: 'Decentralized ledger' },
      { word: 'quantum', hint: 'Advanced computing type' }
    ]
  },
  food: {
    easy: [
      { word: 'rice', hint: 'Staple grain food' },
      { word: 'bread', hint: 'Baked dough' },
      { word: 'apple', hint: 'Red or green fruit' }
    ],
    medium: [
      { word: 'noodle', hint: 'Long, thin pasta' },
      { word: 'pizza', hint: 'Italian dish with toppings' },
      { word: 'sushi', hint: 'Japanese rice and fish' }
    ],
    hard: [
      { word: 'sauerkraut', hint: 'Fermented cabbage' },
      { word: 'quinoa', hint: 'Ancient grain' },
      { word: 'escargot', hint: 'Cooked snails' }
    ]
  },
  sports: {
    easy: [
      { word: 'soccer', hint: 'Game with a ball and goals' },
      { word: 'tennis', hint: 'Racket sport' },
      { word: 'golf', hint: 'Club and ball game' }
    ],
    medium: [
      { word: 'basketball', hint: 'Hoop and ball sport' },
      { word: 'volleyball', hint: 'Net and ball team game' },
      { word: 'cricket', hint: 'Bat and ball team sport' }
    ],
    hard: [
      { word: 'fencing', hint: 'Sword fighting sport' },
      { word: 'biathlon', hint: 'Skiing and shooting' },
      { word: 'curling', hint: 'Ice sport with stones' }
    ]
  },
  movies: {
    easy: [
      { word: 'avatar', hint: 'Blue aliens on Pandora' },
      { word: 'frozen', hint: 'Disney ice queen' },
      { word: 'batman', hint: 'Dark knight superhero' }
    ],
    medium: [
      { word: 'inception', hint: 'Dream within a dream' },
      { word: 'titanic', hint: 'Ship disaster romance' },
      { word: 'jaws', hint: 'Shark thriller' }
    ],
    hard: [
      { word: 'casablanca', hint: 'Classic wartime romance' },
      { word: 'godfather', hint: 'Mafia family saga' },
      { word: 'metropolis', hint: 'Silent sci-fi film' }
    ]
  }
};

let selectedWord = '', hint = '', guessedLetters = [], wrongGuesses = [], remaining = 6, round = 1, score = 0, timer;
let hintUsed = false, playerName = '', maxAttempts = 6, timeLimit = 60, selectedCategory = '', selectedDifficulty = '';

const startGameBtn = document.getElementById('startGameBtn');
const difficultySelect = document.getElementById('difficulty');
const categorySelect = document.getElementById('category');
const playerNameInput = document.getElementById('playerName');

startGameBtn.addEventListener('click', () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert('Please enter your name!');
    return;
  }
  selectedDifficulty = difficultySelect.value;
  selectedCategory = categorySelect.value;
  setDifficultyParams();
  startGame(selectedCategory, selectedDifficulty);
});

function setDifficultyParams() {
  if (selectedDifficulty === 'easy') {
    maxAttempts = 8;
    timeLimit = 90;
  } else if (selectedDifficulty === 'medium') {
    maxAttempts = 6;
    timeLimit = 60;
  } else if (selectedDifficulty === 'hard') {
    maxAttempts = 4;
    timeLimit = 30;
  }
}

function startGame(category, difficulty) {
  document.querySelector('.game-setup').style.display = 'none';
  document.querySelector('.game-container').style.display = 'block';

  if (category === 'random') {
    const categories = Object.keys(words);
    category = categories[Math.floor(Math.random() * categories.length)];
  }

  const wordObj = words[category][difficulty][Math.floor(Math.random() * words[category][difficulty].length)];
  selectedWord = wordObj.word.toLowerCase();
  hint = wordObj.hint;

  guessedLetters = [];
  wrongGuesses = [];
  remaining = maxAttempts;
  hintUsed = false;
  document.getElementById('hintText').textContent = '???';
  document.getElementById('currentCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);
  document.getElementById('wrongGuesses').textContent = '';
  document.getElementById('remaining').textContent = remaining;
  document.getElementById('score').textContent = score;
  document.getElementById('roundDisplay').textContent = `Round: ${round}`;
  document.getElementById('message').textContent = '';
  drawHangman(0);

  updateDisplay();
  startTimer(timeLimit);
}

function updateDisplay() {
  const display = selectedWord
    .split('')
    .map(letter => guessedLetters.includes(letter) ? `<span class="letter">${letter}</span>` : '<span class="letter">_</span>')
    .join(' ');
  document.getElementById('wordDisplay').innerHTML = display;

  if (!display.includes('_')) {
    score += 10 + (remaining * 2);
    round++;
    document.getElementById('message').textContent = '🎉 Correct! Next Round...';
    clearInterval(timer);
    triggerConfetti();
    setTimeout(() => startGame(selectedCategory, selectedDifficulty), 2000);
  }
}

const guessLetterBtn = document.getElementById('guessLetterBtn');
const letterInput = document.getElementById('letterInput');

guessLetterBtn.addEventListener('click', guessLetter);
letterInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') guessLetter();
});

function guessLetter() {
  const letter = letterInput.value.toLowerCase();
  letterInput.value = '';
  if (!letter.match(/[a-z]/) || letter.length !== 1) {
    document.getElementById('message').textContent = 'Please enter a valid letter!';
    return;
  }

  if (guessedLetters.includes(letter) || wrongGuesses.includes(letter)) {
    document.getElementById('message').textContent = 'You already guessed that letter!';
    return;
  }

  if (selectedWord.includes(letter)) {
    guessedLetters.push(letter);
    score += 1;
    // new Audio('correct.mp3').play(); // Uncomment with audio file
  } else {
    wrongGuesses.push(letter);
    remaining--;
    score -= 1;
    drawHangman(maxAttempts - remaining);
    // new Audio('wrong.mp3').play(); // Uncomment with audio file
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
}

const guessWordBtn = document.getElementById('guessWordBtn');
const wordInput = document.getElementById('wordInput');

guessWordBtn.addEventListener('click', guessWord);
wordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') guessWord();
});

function guessWord() {
  const guess = wordInput.value.toLowerCase();
  wordInput.value = '';
  if (!guess.match(/^[a-z]+$/)) {
    document.getElementById('message').textContent = 'Please enter a valid word!';
    return;
  }

  if (guess === selectedWord) {
    guessedLetters = selectedWord.split('');
    updateDisplay();
  } else {
    remaining -= 2;
    if (remaining < 0) remaining = 0;
    document.getElementById('remaining').textContent = remaining;
    drawHangman(maxAttempts - remaining);
    document.getElementById('message').textContent = 'Wrong word guess!';
    if (remaining === 0) {
      document.getElementById('message').textContent = `❌ Game Over! The word was "${selectedWord}"`;
      clearInterval(timer);
      saveHighScore();
    }
  }
}

const hintBtn = document.getElementById('hintBtn');
hintBtn.addEventListener('click', () => {
  if (!hintUsed) {
    document.getElementById('hintText').textContent = hint;
    hintUsed = true;
    score -= 2;
    document.getElementById('score').textContent = score;
  } else {
    document.getElementById('message').textContent = 'Hint already used!';
  }
});

function startTimer(time) {
  let currentTime = time;
  document.getElementById('timer').textContent = currentTime;
  clearInterval(timer);
  timer = setInterval(() => {
    currentTime--;
    document.getElementById('timer').textContent = currentTime;
    if (currentTime <= 10) {
      document.getElementById('timer').style.color = '#dc3545';
    }
    if (currentTime === 0) {
      clearInterval(timer);
      document.getElementById('message').textContent = `⏰ Time's up! The word was "${selectedWord}"`;
      saveHighScore();
    }
  }, 1000);
}

function saveHighScore() {
  const scores = JSON.parse(localStorage.getItem('highScores')) || [];
  scores.push({ name: playerName, score, date: new Date().toLocaleString() });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('highScores', JSON.stringify(scores.slice(0, 10)));
  showLeaderboard();
}

function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('highScores')) || [];
  document.getElementById('highScores').innerHTML = scores
    .map(s => `<li><strong>${s.name}</strong> - ${s.score} pts (${s.date})</li>`)
    .join('');
}

const restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', () => location.reload());

const resetLeaderboardBtn = document.getElementById('resetLeaderboardBtn');
resetLeaderboardBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset the leaderboard?')) {
    localStorage.removeItem('highScores');
    showLeaderboard();
  }
});

function drawHangman(stage) {
  const hangmanParts = [
    '<div class="base"></div>',
    '<div class="pole"></div>',
    '<div class="beam"></div>',
    '<div class="rope"></div>',
    '<div class="head"></div>',
    '<div class="body"></div>',
    '<div class="arm left"></div>',
    '<div class="arm right"></div>',
    '<div class="leg left"></div>',
    '<div class="leg right"></div>'
  ];
  const html = hangmanParts.slice(0, stage).join('');
  document.getElementById('hangman').innerHTML = html;
}

function triggerConfetti() {
  const confetti = document.getElementById('confetti');
  confetti.innerHTML = '';
  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.width = `${Math.random() * 10 + 5}px`;
    piece.style.height = `${Math.random() * 20 + 10}px`;
    confetti.appendChild(piece);
  }
  setTimeout(() => confetti.innerHTML = '', 3000);
}

showLeaderboard();