        const box = document.getElementById('box');
        const scoreDisplay = document.getElementById('score');
        const timeLeftDisplay = document.getElementById('time-left');

        let score = 0;
        let timeLeft = 30;

        // Move the box to a random position
        function moveBox() {
            const gameArea = document.getElementById('game-area');
            const areaWidth = gameArea.offsetWidth;
            const areaHeight = gameArea.offsetHeight;
            const boxWidth = box.offsetWidth;
            const boxHeight = box.offsetHeight;

            const maxX = areaWidth - boxWidth;
            const maxY = areaHeight - boxHeight;

            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);

            box.style.left = `${randomX}px`;
            box.style.top = `${randomY}px`;
        }

        // Update the score and move the box when it's clicked
        box.addEventListener('click', () => {
            score++;
            scoreDisplay.textContent = score;
            moveBox();
        });

        // Countdown timer
        function startTimer() {
            const timerInterval = setInterval(() => {
                timeLeft--;
                timeLeftDisplay.textContent = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert('Time is up! Your score is ' + score);
                    box.style.display = 'none'; // Hide the box
                }
            }, 1000);
        }

        // Start the game when the page loads
        window.onload = () => {
            moveBox();
            startTimer();
        };

        box.onclick = () => {
            box.style.backgroundColor = getRandomColor();
        };
        function getRandomColor() {
            let red = Math.floor(Math.random() * 255);
            let green = Math.floor(Math.random() * 255);
            let blue = Math.floor(Math.random() * 255);

    let color= `rgb(${red}, ${green}, ${blue})`;
    return color;
}
