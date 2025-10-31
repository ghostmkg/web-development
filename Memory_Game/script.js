const cards = [
    'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
    'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
];

let cardElements = [];
let firstCard, secondCard;
let lockBoard = false;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createCard(letter) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.letter = letter;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.letter;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}
function emoji(){
    
}


function checkForMatch() {
    lockBoard = true;

    const isMatch = firstCard.dataset.letter === secondCard.dataset.letter;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function resetGame() {
    cardElements.forEach(card => card.remove());
    cardElements = [];
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    initializeGame();
}

function initializeGame() {
    shuffle(cards);
    const gameBoard = document.getElementById('gameBoard');

    cards.forEach(letter => {
        const card = createCard(letter);
        gameBoard.appendChild(card);
        cardElements.push(card);
    });
}

document.getElementById('resetButton').addEventListener('click', resetGame);

initializeGame();
