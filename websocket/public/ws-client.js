// This file will contain the WebSocket client logic.
// It will be responsible for connecting, disconnecting, sending, and receiving messages.

class WebSocketClient {
    constructor() {
        this.socket = null;
        this.reconnect = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectInterval = 1000; // start with 1s
    }

    connect(url, autoReconnect = false) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('Already connected.');
            return;
        }

        this.reconnect = autoReconnect;
        this.url = url;

        // Reset reconnect attempts on new manual connection
        this.reconnectAttempts = 0;

        window.logMessage(`Connecting to ${url}...`, 'info');
        this._doConnect(url);
    }

    _doConnect(url) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connection opened');
            window.logMessage('Connection established.', 'info');
            window.ui.setConnectedState(true);
            this.reconnectAttempts = 0; // Reset on successful connection
            this.reconnectInterval = 1000; // Reset interval
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed', event);
            window.logMessage(`Connection closed: ${event.code} ${event.reason}`, 'error');
            window.ui.setConnectedState(false);

            if (this.reconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                window.showReconnectAttempts(this.reconnectAttempts);
                const timeout = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
                window.logMessage(`Attempting to reconnect in ${timeout / 1000}s...`, 'info');
                
                setTimeout(() => {
                    window.updateStatus('connecting', 'Reconnecting...');
                    this._doConnect(this.url);
                }, timeout);
            } else if (this.reconnect) {
                window.logMessage('Max reconnect attempts reached.', 'error');
            }
        };

        this.socket.onmessage = (event) => {
            console.log('Message from server: ', event.data);
            window.logMessage(event.data, 'incoming');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
            window.logMessage('An error occurred with the connection.', 'error');
            // onclose will be called automatically after an error.
        };
    }

    disconnect() {
        if (this.socket) {
            this.reconnect = false; // Disable reconnect on manual disconnect
            this.socket.close();
            console.log('Manual disconnect initiated.');
        }
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
            window.logMessage(message, 'outgoing');
        } else {
            window.logMessage('Cannot send message. Not connected.', 'error');
        }
    }
}

// Make it globally available for now, to be instantiated by ui.js
window.wsClient = new WebSocketClient();
