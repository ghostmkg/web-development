document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = Array.from(document.getElementsByClassName('btn'));
    let currentInput = '';
    let operator = '';
    let previousInput = '';

    buttons.map(button => {
        button.addEventListener('click', (e) => {
            const value = e.target.innerText;

            if (value === 'C') {
                currentInput = '';
                previousInput = '';
                operator = '';
                display.innerText = '0';
            } else if (value === '=') {
                if (currentInput && previousInput && operator) {
                    currentInput = eval(`${previousInput}${operator}${currentInput}`);
                    display.innerText = currentInput;
                    previousInput = '';
                    operator = '';
                }
            } else if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput) {
                    operator = value;
                    previousInput = currentInput;
                    currentInput = '';
                }
            } else {
                currentInput += value;
                display.innerText = currentInput;
            }
        });
    });
});
