let para = document.getElementById("p");
function calculateAge() {
    const dobInput = document.getElementById('dob').value;
    const resultElement = document.getElementById('result');

    if (!dobInput) {
        resultElement.innerHTML = "<p style='color:red;'>Please enter your date of birth.</p>";
        return;
    }
    if (year < 1000 || year > 2099 || year.length !== 4) {
        resultElement.innerHTML = "<p style='color:red;'>Please enter a valid year between 1000 and 2099.</p>";
        return;
    }

    const dob = new Date(dobInput);
    const today = new Date();
    

    let ageYears = today.getFullYear() - dob.getFullYear();
    let ageMonths = today.getMonth() - dob.getMonth();
    let ageDays = today.getDate() - dob.getDate();

    if (ageDays < 0) {
        ageMonths--;
        ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
    }

    resultElement.innerHTML = `
        <p>You are <strong>${ageYears}</strong> years, <strong>${ageMonths}</strong> months, 
        and <strong>${ageDays}</strong> days old.</p>`;

          const funFacts = [
        "Fun fact: January is named after Janus, the Roman god of doors and gates.",
        "Fun fact: February is the only month that can have a leap day.",
        "Fun fact: March is named after Mars, the Roman god of war.",
        "Fun fact: April is named after the Latin word 'aperire', which means 'to open'.",
        "Fun fact: May is named after Maia, an earth goddess of growing plants.",
        "Fun fact: June is named after Juno, the Roman goddess of marriage and childbirth.",
        "Fun fact: July is named after Julius Caesar, who was born in this month.",
        "Fun fact: August is named after Augustus Caesar, the first Roman emperor.",
        "Fun fact: September is derived from the Latin word 'septem', meaning 'seven'.",
        "Fun fact: October is derived from the Latin word 'octo', meaning 'eight'.",
        "Fun fact: November is derived from the Latin word 'novem', meaning 'nine'.",
        "Fun fact: December is derived from the Latin word 'decem', meaning 'ten'."
    ];

    const colors = [
        "olive", "green", "maroon", "pink", "purple", "red",
        "brown", "cyan", "magenta", "lime", "navy", "teal"
    ];

    
    const agePara = resultElement.querySelector("p");
    if (agePara) {
        agePara.style.color = "blue";
    }

    
    const month = dob.getMonth();
    para.innerText = funFacts[month];
    para.style.color = colors[month];
    resultElement.appendChild(para);
}
