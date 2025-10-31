const display=document.querySelector(".display");
const buttons=document.querySelectorAll("button");
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "";

//Define function to calculate based on button clicked.
const calculate = (btnValue) => {
  display.focus();
  if (btnValue === "=" && output !== "") {
    //If output has '%', replace with '/100' before evaluating.
    try {
      output = new Function('return ' + output.replace(/%/g, '/100'))();
    } catch (e) {
      output = "Error";
    }
  } else if (btnValue === "AC") {
    output = "";
  } else if (btnValue === "DEL") {
    //If DEL button is clicked, remove the last character from the output.
    output = output.toString().slice(0, -1);
  } else {
    //If output is empty and button is specialChars then return
    if (output === "" && specialChars.includes(btnValue)) return;
    if (specialChars.includes(btnValue) && specialChars.includes(output.slice(-1))) {
      // Do not allow two operators in a row
      return;
    }
    output += btnValue;
  }
  display.value = output;
};


buttons.forEach((button)=>{
    button.addEventListener('click',(e)=>
        calculate(e.target.dataset.value));
})