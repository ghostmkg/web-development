const SIZE = 4;
let grid = createEmptyGrid();
let score = 0;

const container = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

// Create empty 4x4 grid
function createEmptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

// Add a new tile (2 or 4) at a random empty spot
function addRandomTile() {
  const empty = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return false;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

// Draw the grid on screen
function render() {
  container.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const val = grid[r][c];
      const div = document.createElement('div');
      div.className = 'cell';
      if (val !== 0) {
        div.textContent = val;
        div.setAttribute('data-value', val);
      }
      container.appendChild(div);
    }
  }
  scoreDisplay.textContent = score;
}

// Compress row (remove zeros, keep order)
function compressRow(row) {
  const newRow = row.filter(x => x !== 0);
  while (newRow.length < SIZE) newRow.push(0);
  return newRow;
}

// Merge tiles in a row (move left logic)
function mergeRow(row) {
  row = compressRow(row);
  for (let i = 0; i < SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
      i++;
    }
  }
  return compressRow(row);
}

// Basic move functions
function moveLeft(board) {
  return board.map(row => mergeRow(row.slice()));
}

function moveRight(board) {
  return board.map(row => mergeRow(row.slice().reverse()).reverse());
}

function moveUp(board) {
  const transposed = transpose(board);
  const moved = transposed.map(row => mergeRow(row));
  return transpose(moved);
}

function moveDown(board) {
  const transposed = transpose(board);
  const moved = transposed.map(row => mergeRow(row.slice().reverse()).reverse());
  return transpose(moved);
}

// Transpose matrix
function transpose(board) {
  const t = createEmptyGrid();
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      t[c][r] = board[r][c];
  return t;
}

// Compare matrices
function matricesEqual(a, b) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (a[r][c] !== b[r][c]) return false;
  return true;
}

// Check if moves are possible
function canMove() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

// Perform move based on direction
function performMove(direction) {
  const before = grid.map(row => row.slice());
  let after;
  if (direction === 'left') after = moveLeft(grid);
  else if (direction === 'right') after = moveRight(grid);
  else if (direction === 'up') after = moveUp(grid);
  else if (direction === 'down') after = moveDown(grid);
  else return false;

  if (!matricesEqual(before, after)) {
    grid = after;
    addRandomTile();
    render();
    if (!canMove()) {
      setTimeout(() => alert('Game Over! Final Score: ' + score), 100);
    }
    return true;
  }
  return false;
}

// Keyboard controls
window.addEventListener('keydown', (e) => {
  const key = e.key;
  let moved = false;
  if (key === 'ArrowLeft') moved = performMove('left');
  else if (key === 'ArrowRight') moved = performMove('right');
  else if (key === 'ArrowUp') moved = performMove('up');
  else if (key === 'ArrowDown') moved = performMove('down');
  if (moved) e.preventDefault();
});

// Start or restart the game
function startGame() {
  grid = createEmptyGrid();
  score = 0;
  addRandomTile();
  addRandomTile();
  render();
}
// Restart button event
const restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', () => {
  startGame();
});


startGame();
