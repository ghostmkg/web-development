function fetchRepositories() {
    const username = document.getElementById('username').value;

    // Redirect to the results page
    window.location.href = `results.html?username=${username}`;
}
