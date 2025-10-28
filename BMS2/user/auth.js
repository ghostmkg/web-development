// auth.js - Shared authentication logic

const API_BASE_URL_AUTH = 'http://127.0.0.1:5000/api/auth'; // <<< USE 127.0.0.1

async function checkLoginStatus() {
    console.log("[AUTH.JS] Checking login status...");
    try {
        const response = await fetch(`${API_BASE_URL_AUTH}/status`, {
            method: 'GET',
            credentials: 'include' 
        });
        let data = { isLoggedIn: false, message: "Failed to get status or parse response." };
        try { data = await response.json(); } 
        catch (e) { 
            console.error("[AUTH.JS] Error parsing JSON from /status:", e, "Response was:", response);
            if (response.ok) data.message = "Status check OK, but response not valid JSON.";
        }
        console.log("[AUTH.JS] Auth status from server. Status code:", response.status, "Data:", data);
        if (typeof data.isLoggedIn !== 'boolean') data.isLoggedIn = false; 
        return data; 
    } catch (error) {
        console.error('[AUTH.JS] Network error during checkLoginStatus:', error);
        return { isLoggedIn: false, message: "Network error: Could not connect for status check." }; 
    }
}

async function handleLogout() {
    console.log("[AUTH.JS] Handling logout...");
    try {
        const response = await fetch(`${API_BASE_URL_AUTH}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message || "Logout successful.");
            updateNavUI(false); 
            if (window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html')) {
                window.location.href = 'index.html';
            } else {
                 window.location.reload(); 
            }
        } else {
            alert(result.message || 'Logout failed.');
        }
    } catch (error) {
        console.error('[AUTH.JS] Logout error:', error);
        alert('An error occurred during logout.');
    }
}

function updateNavUI(isLoggedIn, username = '') {
    const authLinksContainer = document.getElementById('auth-links-container');
    if (!authLinksContainer) return; 
    console.log(`[AUTH.JS] Updating Nav UI. LoggedIn: ${isLoggedIn}, Username: ${username}`);
    if (isLoggedIn) {
        // Use CSS classes instead of inline styles
        authLinksContainer.innerHTML = `
            <span class="nav-welcome-message">Welcome, ${username}!</span>
            <a href="my_bookings.html" class="nav-link">My Bookings</a>
            <button id="logoutButton" class="logout-btn">Logout</button>
        `;
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    } else {
        authLinksContainer.innerHTML = `
            <a href="login.html" class="nav-link">Login</a>
            <a href="signup.html" class="nav-link">Sign Up</a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("[AUTH.JS] DOMContentLoaded - Initializing.");
    const status = await checkLoginStatus();
    updateNavUI(status.isLoggedIn, status.username);

    const protectedPages = ['my_bookings.html', 'seats.html', 'ticket.html'];
    const currentPageFileName = window.location.pathname.split('/').pop();
    const isProtected = protectedPages.includes(currentPageFileName);

    console.log(`[AUTH.JS] Page: ${currentPageFileName}, Protected: ${isProtected}, ServerLoggedIn: ${status.isLoggedIn}`);

    if (isProtected && !status.isLoggedIn) {
        console.log(`[AUTH.JS] Redirecting from protected page '${currentPageFileName}' to login.`);
        const redirectUrl = window.location.pathname + window.location.search; 
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }
});