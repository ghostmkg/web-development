document.addEventListener('DOMContentLoaded', () => {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');

    // This is a global hook that the ws-client.js can use to update the UI.
    window.updateStatus = (status, message) => {
        statusIndicator.className = status; // 'connected', 'disconnected', 'connecting'
        statusText.textContent = message;
    };

    // Initialize
    window.updateStatus('disconnected', 'Disconnected');
});
