document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
  
    // Sample validation
    if (username === "customer" && password === "password123") {
      errorMessage.style.color = "green";
      errorMessage.textContent = "Login successful!";
      // Redirect to dashboard or customer page
      setTimeout(() => window.location.href = "dashboard.html", 1000);
    } else {
      errorMessage.textContent = "Invalid username or password";
    }
  });