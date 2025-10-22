const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#status');
const restartBtn = document.querySelector('#restart');

let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let running = true;

const winConditions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

cells.forEach(cell => cell.addEventListener('click', cellClicked));
restartBtn.addEventListener('click', restartGame);

function cellClicked() {
  const index = this.getAttribute('data-index');

  if(board[index] !== "" || !running) return;

  board[index] = currentPlayer;
  this.textContent = currentPlayer;

  checkWinner();
}

function checkWinner() {
  let roundWon = false;

  for(let condition of winConditions) {
    const [a, b, c] = condition;
    if(board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if(roundWon) {
    statusText.textContent = ` Player ${currentPlayer} Wins!`;
    running = false;
  } else if(!board.includes("")) {
    statusText.textContent = "It's a Draw ";
    running = false;
  } else {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function restartGame() {
  currentPlayer = 'X';
  board = ["", "", "", "", "", "", "", "", ""];
  running = true;
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => cell.textContent = "");
}
