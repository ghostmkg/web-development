// Function to generate a random password
function generatePassword() {
    const length = 12;  // Length of the password
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
    let password = "";
    
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }

    return password;
}

// Function to copy the password to clipboard
function copyToClipboard() {
    const passwordField = document.getElementById("password");
    passwordField.select();
    document.execCommand("copy");

    // Display confirmation message
    const copyMessage = document.getElementById("copyMessage");
    copyMessage.style.display = "block";

    // Hide the message after 2 seconds
    setTimeout(() => {
        copyMessage.style.display = "none";
    }, 2000);
}

// Add event listeners to buttons
document.getElementById("generateBtn").addEventListener("click", () => {
    const passwordField = document.getElementById("password");
    passwordField.value = generatePassword();
});

document.getElementById("copyBtn").addEventListener("click", copyToClipboard);
