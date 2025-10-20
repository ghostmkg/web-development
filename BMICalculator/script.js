const h = document.querySelector("#h");
const w = document.querySelector("#w");
const btn = document.querySelector("#calc");
const num = document.querySelector("#ans-num");
const cat = document.querySelector("#ans-cat");

btn.addEventListener("click", calculate);

function calculate() {
  // Parse inputs as numbers and validate presence
  const height = parseFloat(h.value);
  const weight = parseFloat(w.value);

  // Reject empty or non-numeric inputs
  if (isNaN(height) || isNaN(weight)) {
    num.textContent = "Invalid";
    cat.textContent = "Invalid";
    return;
  }

  // Range validation
  if (height > 250 || height < 50 || weight > 250 || weight < 4) {
    num.textContent = "Invalid";
    cat.textContent = "Invalid";
    return;
  }

  // Compute BMI using meters and floats
  const heightMeters = height / 100;
  if (heightMeters === 0) {
    num.textContent = "Invalid";
    cat.textContent = "Invalid";
    return;
  }

  const bmi = weight / (heightMeters * heightMeters);

  // Display BMI with two decimal places
  num.textContent = bmi.toFixed(2);

  if (bmi < 18.5) {
    cat.textContent = "Under Weight";
  } else if (bmi >= 18.5 && bmi < 25) {
    cat.textContent = "Normal";
  } else if (bmi >= 25 && bmi < 30) {
    cat.textContent = "Over Weight";
  } else if (bmi >= 30 && bmi < 40) {
    cat.textContent = "Obesity";
  } else if (bmi >= 40) {
    cat.textContent = "Extreme Obesity";
  } else {
    cat.textContent = "Invalid";
  }
}
