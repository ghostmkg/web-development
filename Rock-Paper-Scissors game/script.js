let userScore = 0;
let computerScore = 0;

const userScoreDisplay = document.getElementById('userScore');
const computerScoreDisplay = document.getElementById('computerScore');
const resultDisplay = document.getElementById('result');
const winSound = document.getElementById('winSound');
const loseSound = document.getElementById('loseSound');
const tieSound = document.getElementById('tieSound');
const resetButton = document.getElementById('resetButton');

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        const userChoice = button.id;
        const computerChoice = getComputerChoice();
        const result = determineWinner(userChoice, computerChoice);

        updateScore(result);
        displayResult(result, computerChoice);
        animateChoice(userChoice, computerChoice);
    });
});

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return 'tie';
    } else if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    } else {
        return 'lose';
    }
}

function updateScore(result) {
    if (result === 'win') {
        userScore++;
        winSound.play();
    } else if (result === 'lose') {
        computerScore++;
        loseSound.play();
    } else {
        tieSound.play();
    }

    userScoreDisplay.innerText = userScore;
    computerScoreDisplay.innerText = computerScore;
}

function displayResult(result, computerChoice) {
    if (result === 'tie') {
        resultDisplay.innerText = `It's a tie! Computer chose ${computerChoice}.`;
        resultDisplay.style.color = 'gray';
    } else if (result === 'win') {
        resultDisplay.innerText = `You win! Computer chose ${computerChoice}.`;
        resultDisplay.style.color = 'green';
    } else {
        resultDisplay.innerText = `You lose! Computer chose ${computerChoice}.`;
        resultDisplay.style.color = 'red';
    }
}

function animateChoice(userChoice, computerChoice) {
    const userChoiceElement = document.getElementById(userChoice);
    const computerChoiceElement = document.createElement('div');
    computerChoiceElement.innerText = `Computer chose ${computerChoice}`;
    computerChoiceElement.style.fontSize = '20px';
    computerChoiceElement.style.marginTop = '10px';

    document.getElementById('gameContainer').appendChild(computerChoiceElement);
    setTimeout(() => {
        computerChoiceElement.remove();
    }, 3000);
}

resetButton.addEventListener('click', () => {
    userScore = 0;
    computerScore = 0;
    userScoreDisplay.innerText = userScore;
    computerScoreDisplay.innerText = computerScore;
    resultDisplay.innerText = '';
});
