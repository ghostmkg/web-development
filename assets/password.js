function checkPasswordStrength() {
  const passwordInput = document.getElementById('password');
  const strengthText = document.getElementById('strength-text');
  const suggestionsText = document.getElementById('suggestions-text');

  const password = passwordInput.value;
  const strength = calculatePasswordStrength(password);
  const suggestions = generatePasswordSuggestions();

  // Update the strength and suggestions text
  strengthText.textContent = `Password Strength: ${strength}`;
  suggestionsText.textContent = `Suggestions: ${suggestions.join(', ')}`;
}

function calculatePasswordStrength(password) {
  // Criteria for a strong password
  const lengthCriteria = 8;
  const uppercaseCriteria = /[A-Z]/;
  const lowercaseCriteria = /[a-z]/;
  const numberCriteria = /\d/;
  const specialCharCriteria = /[!@#$%^&*(),.?"':;{}|<>]/;

  // Calculate strength based on criteria
  let strength = 0;

  // Check length
  strength += password.length >= lengthCriteria ? 1 : 0;

  // Check for uppercase letters
  strength += uppercaseCriteria.test(password) ? 1 : 0;

  // Check for lowercase letters
  strength += lowercaseCriteria.test(password) ? 1 : 0;

  // Check for numbers
  strength += numberCriteria.test(password) ? 1 : 0;

  // Check for special characters
  strength += specialCharCriteria.test(password) ? 1 : 0;

  // Map strength to descriptive text
  switch (strength) {
      case 0:
          return 'Very Weak';
      case 1:
          return 'Weak';
      case 2:
          return 'Moderate';
      case 3:
          return 'Strong';
      case 4:
          return 'Very Strong';
      default:
          return '';
  }
}

function generatePasswordSuggestions() {
  const suggestions = [];

  // Generate suggestions based on criteria
  suggestions.push('Use a mix of uppercase and lowercase letters.');
  suggestions.push('Include numbers in your password.');
  suggestions.push('Add special characters for extra security.');
  suggestions.push('Make sure your password is at least 8 characters long.');

  return suggestions;
}
