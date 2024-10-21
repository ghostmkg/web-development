const paletteContainer = document.querySelector('.palette');
const generateBtn = document.getElementById('generateBtn');

// Function to generate a random hex color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to generate the color palette
function generatePalette() {
    paletteContainer.innerHTML = ''; // Clear the palette container

    for (let i = 0; i < 5; i++) { // Generate 5 random colors
        const color = getRandomColor();
        const swatch = document.createElement('div');
        swatch.classList.add('swatch');
        swatch.style.backgroundColor = color;
        swatch.setAttribute('title', color); // Show the color code on hover
        
        // Click event to copy color to clipboard
        swatch.addEventListener('click', () => {
            navigator.clipboard.writeText(color);
            alert(`Copied ${color} to clipboard!`);
        });
        
        paletteContainer.appendChild(swatch);
    }
}

// Event listener for the generate button
generateBtn.addEventListener('click', generatePalette);

// Generate an initial palette on page load
generatePalette();
