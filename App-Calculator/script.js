function calculateAge() {
    const dobInput = document.getElementById('dob').value;
    const resultElement = document.getElementById('result');

    if (!dobInput) {
        resultElement.innerHTML = "<p style='color:red;'>Please enter your date of birth.</p>";
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
}