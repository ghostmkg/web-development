document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const connectBtn = document.getElementById('connect-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const connectionForm = document.getElementById('connection-form');
    const wsUrlInput = document.getElementById('ws-url');
    const autoReconnectCheckbox = document.getElementById('auto-reconnect');
    const reconnectAttemptsSpan = document.getElementById('reconnect-attempts');
    const logsContainer = document.getElementById('logs');
    const clearLogsBtn = document.getElementById('clear-logs-btn');

    // --- UI State Management ---
    const setConnectingState = (isConnecting) => {
        if (isConnecting) {
            updateStatus('connecting', 'Connecting...');
            wsUrlInput.disabled = true;
            connectBtn.disabled = true;
            disconnectBtn.disabled = false;
        } else {
            // Final state is handled by setConnectedState or setDisconnectedState
        }
    };

    const setConnectedState = (isConnected) => {
        if (isConnected) {
            updateStatus('connected', 'Connected');
            wsUrlInput.disabled = true;
            connectBtn.disabled = true;
            disconnectBtn.disabled = false;
        } else {
            updateStatus('disconnected', 'Disconnected');
            wsUrlInput.disabled = false;
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
        }
        reconnectAttemptsSpan.textContent = '';
    };

    // --- Global UI Hooks ---
    window.updateStatus = (status, message) => {
        statusIndicator.className = status;
        statusText.textContent = message;
        statusText.title = `Last event: ${new Date().toLocaleTimeString()}`;
    };

    window.logMessage = (message, type = 'info') => {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        
        const msg = document.createElement('span');
        msg.className = 'message';
        msg.textContent = message;

        entry.appendChild(timestamp);
        entry.appendChild(msg);
        logsContainer.appendChild(entry);

        // Scroll to the bottom
        logsContainer.scrollTop = logsContainer.scrollHeight;
    };

    window.showReconnectAttempts = (count) => {
        reconnectAttemptsSpan.textContent = `(Attempt ${count})`;
    };

    // --- Event Listeners ---
    connectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = wsUrlInput.value;
        if (!url) return;

        setConnectingState(true);
        window.wsClient.connect(url, autoReconnectCheckbox.checked);
    });

    disconnectBtn.addEventListener('click', () => {
        window.wsClient.disconnect();
        setConnectedState(false);
    });

    clearLogsBtn.addEventListener('click', () => {
        logsContainer.innerHTML = '';
    });

    // --- Initialization ---
    // The wsClient will call this when connection is established or fails
    window.ui = {
        setConnectedState,
        setConnectingState,
    };

    // Initial state
    setConnectedState(false);
});
