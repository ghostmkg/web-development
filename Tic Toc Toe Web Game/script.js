const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');

const modeHumanRadio = document.getElementById('mode-human');
const modeAIRadio = document.getElementById('mode-ai');
const difficultySelectionDiv = document.querySelector('.difficulty-selection');
const difficultySelect = document.getElementById('difficulty');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let gameActive = true;
let gameMode = 'human'; // 'human' or 'ai'
let aiDifficulty = 'easy'; // 'easy', 'medium', 'hard'

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// --- Game Logic Functions ---

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameState[index] !== null || !gameActive) return; // Cell already taken or game over

    makeMove(index, currentPlayer);

    if (checkGameStatus()) return; // Check for win/draw after human move

    // If playing with AI and it's AI's turn
    if (gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500); // Give a slight delay for AI move
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase()); // Add class for styling X/O
}

function checkGameStatus() {
    if (checkWinner()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return true;
    } else if (gameState.every(cell => cell !== null)) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
        return false;
    }
}

function checkWinner() {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return gameState[a] !== null && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

function restartGame() {
    gameState = Array(9).fill(null);
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o'); // Remove X/O styling classes
    });

    if (gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500); // If AI starts, make its move
    }
}

// --- AI Logic Functions ---

function makeAIMove() {
    if (!gameActive) return;

    let move;
    switch (aiDifficulty) {
        case 'easy':
            move = getEasyAIMove();
            break;
        case 'medium':
            move = getMediumAIMove();
            break;
        case 'hard':
            move = getHardAIMove();
            break;
        default:
            move = getEasyAIMove();
    }

    if (move !== undefined) {
        makeMove(move, 'O');
        checkGameStatus();
    }
}

function getAvailableMoves() {
    return gameState.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
}

function getEasyAIMove() {
    const availableMoves = getAvailableMoves();
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

function getMediumAIMove() {
    const availableMoves = getAvailableMoves();

    // 1. Check for AI winning move
    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        gameState[move] = 'O'; // Simulate move
        if (checkWinner()) {
            gameState[move] = null; // Revert
            return move;
        }
        gameState[move] = null; // Revert
    }

    // 2. Check to block player's winning move
    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        gameState[move] = 'X'; // Simulate player's move
        if (checkWinner()) {
            gameState[move] = null; // Revert
            return move;
        }
        gameState[move] = null; // Revert
    }

    // 3. Otherwise, take a random move (easy strategy)
    return getEasyAIMove();
}

function getHardAIMove() {
    return findBestMove(gameState, 'O').index;
}

// Minimax algorithm implementation
function findBestMove(board, player) {
    const availableSpots = getAvailableMoves();

    // Check for terminal states
    if (checkWinningState(board, 'X')) {
        return { score: -10 }; // X (human) wins, bad for AI
    } else if (checkWinningState(board, 'O')) {
        return { score: 10 }; // O (AI) wins, good for AI
    } else if (availableSpots.length === 0) {
        return { score: 0 }; // Draw
    }

    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];

        board[availableSpots[i]] = player; // Make the move

        if (player === 'O') { // AI's turn (maximize score)
            const result = findBestMove(board, 'X');
            move.score = result.score;
        } else { // Human's turn (minimize score)
            const result = findBestMove(board, 'O');
            move.score = result.score;
        }

        board[availableSpots[i]] = null; // Undo the move

        moves.push(move);
    }

    let bestMove;
    if (player === 'O') { // AI (maximizing player)
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else { // Human (minimizing player)
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }
    return bestMove;
}

// Helper for minimax to check winner on a given board state
function checkWinningState(currentBoard, player) {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return currentBoard[a] === player && currentBoard[b] === player && currentBoard[c] === player;
    });
}


// --- Event Listeners ---

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

modeHumanRadio.addEventListener('change', () => {
    gameMode = 'human';
    difficultySelectionDiv.style.display = 'none';
    restartGame();
});

modeAIRadio.addEventListener('change', () => {
    gameMode = 'ai';
    difficultySelectionDiv.style.display = 'flex'; // Display flex for alignment
    aiDifficulty = difficultySelect.value; // Set initial AI difficulty
    restartGame(); // Restart game to apply AI mode
});

difficultySelect.addEventListener('change', () => {
    aiDifficulty = difficultySelect.value;
    restartGame(); // Restart game to apply new difficulty
});

// Initial setup for AI to make a move if it's 'O' and AI mode is active
// This ensures AI plays first if currentPlayer is 'O' at start (e.g., after restart with AI mode)
// But wait, the default start is Player X. The AI would only move if X wasn't first.
// So, we add a check in restartGame to trigger AI if it's AI mode and 'O' is current player.