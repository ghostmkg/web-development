// BMI Calculator JavaScript - Enhanced Version

// Get form element
const form = document.querySelector('form');
const heightInput = document.querySelector('#height');
const weightInput = document.querySelector('#weight');
const results = document.querySelector('#results');

// BMI calculation and form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Parse input values
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    
    // Clear previous results
    results.classList.remove('show');
    
    // Comprehensive validation
    if (!validateInputs(height, weight)) {
        return;
    }
    
    // Calculate BMI
    const bmi = calculateBMI(weight, height);
    
    // Display results
    displayResults(bmi);
});

// Input validation function
function validateInputs(height, weight) {
    if (isNaN(height) || height <= 0) {
        showError("Please enter a valid height (greater than 0)");
        heightInput.focus();
        return false;
    }
    
    if (height < 50 || height > 300) {
        showError("Height should be between 50-300 cm");
        heightInput.focus();
        return false;
    }
    
    if (isNaN(weight) || weight <= 0) {
        showError("Please enter a valid weight (greater than 0)");
        weightInput.focus();
        return false;
    }
    
    if (weight < 20 || weight > 500) {
        showError("Weight should be between 20-500 kg");
        weightInput.focus();
        return false;
    }
    
    return true;
}

// BMI calculation function
function calculateBMI(weight, height) {
    // Convert height from cm to meters and calculate BMI
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

// Display results function
function displayResults(bmi) {
    const { category, message, description } = getBMICategory(bmi);
    
    results.innerHTML = `
        <div class="bmi-result ${category}">
            <div class="bmi-value">BMI: ${bmi}</div>
            <div class="bmi-message">${message}</div>
            <div class="bmi-description">${description}</div>
        </div>
    `;
    
    // Add animation
    setTimeout(() => {
        results.classList.add('show');
    }, 100);
}

// Get BMI category and messages
function getBMICategory(bmi) {
    const bmiValue = parseFloat(bmi);
    
    if (bmiValue < 18.5) {
        return {
            category: 'underweight',
            message: 'Underweight',
            description: 'Consider consulting a healthcare provider for nutritional advice.'
        };
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
        return {
            category: 'normal',
            message: 'Normal Weight',
            description: 'Great! You\'re in the healthy weight range.'
        };
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
        return {
            category: 'overweight',
            message: 'Overweight',
            description: 'Consider a balanced diet and regular exercise.'
        };
    } else {
        return {
            category: 'obese',
            message: 'Obese',
            description: 'Consult a healthcare provider for personalized advice.'
        };
    }
}

// Show error messages
function showError(message) {
    results.innerHTML = `<div class="error-message">${message}</div>`;
    results.classList.add('show');
}

// Real-time input validation
heightInput.addEventListener('input', function() {
    validateInputRange(this, 50, 300, 'cm');
});

weightInput.addEventListener('input', function() {
    validateInputRange(this, 20, 500, 'kg');
});

// Input range validation helper
function validateInputRange(input, min, max, unit) {
    const value = parseFloat(input.value);
    
    if (value && (value < min || value > max)) {
        input.style.borderColor = '#ff6b6b';
        input.title = `Please enter a value between ${min}-${max} ${unit}`;
    } else {
        input.style.borderColor = '#212121';
        input.title = '';
    }
}

// Clear results when inputs change
function clearResults() {
    results.innerHTML = '';
    results.classList.remove('show');
}

heightInput.addEventListener('input', clearResults);
weightInput.addEventListener('input', clearResults);

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (document.activeElement === heightInput || document.activeElement === weightInput)) {
        form.dispatchEvent(new Event('submit'));
    }
});
