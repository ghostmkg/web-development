const h = document.querySelector("#h");
const w = document.querySelector("#w");
const btn = document.querySelector("#calc");
const num = document.querySelector("#ans-num");
const cat = document.querySelector("#ans-cat");

btn.addEventListener("click", calculate);

function calculate() {
  if (h.value > 250 || h.value < 50 || w.value > 250 || w.value < 4) {
    num.textContent = "Invalid";
    cat.textContent = "Invalid";
    return;
  }

  var den = Math.floor(h.value) * Math.floor(h.value) * 0.0001;
  var bmi = Math.floor(w.value) / den;

  num.textContent = bmi.toString();

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
