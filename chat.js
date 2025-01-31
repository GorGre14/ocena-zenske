class Chat {
    constructor() {
        this.username = '';
        this.socket = io();
        
        // DOM elements
        this.usernameInput = document.getElementById('username');
        this.joinButton = document.getElementById('joinChat');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendMessage');
        this.messagesContainer = document.getElementById('chatMessages');
        this.onlineUsersElement = document.getElementById('onlineUsers');
        this.typingStatusElement = document.getElementById('typingStatus');
        
        // Event listeners
        this.joinButton.addEventListener('click', () => this.joinChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.messageInput.addEventListener('input', () => this.handleTyping());
        
        // Socket event handlers
        this.socket.on('userJoined', (data) => {
            this.addSystemMessage(`${data.username} se je pridružil/a klepetu`);
            this.updateOnlineUsers(data.userCount);
        });
        
        this.socket.on('userLeft', (data) => {
            this.addSystemMessage(`${data.username} je zapustil/a klepet`);
            this.updateOnlineUsers(data.userCount);
        });
        
        this.socket.on('newMessage', (messageObj) => {
            this.addMessage(messageObj);
        });
        
        this.socket.on('previousMessages', (messages) => {
            messages.forEach(msg => this.addMessage(msg));
        });
        
        this.socket.on('userTyping', (username) => {
            this.typingStatusElement.textContent = `${username} piše...`;
            setTimeout(() => {
                this.typingStatusElement.textContent = '';
            }, 2000);
        });
    }
    
    joinChat() {
        const username = this.usernameInput.value.trim();
        if (username) {
            this.username = username;
            this.socket.emit('join', username);
            
            // Enable chat
            this.messageInput.disabled = false;
            this.sendButton.disabled = false;
            this.usernameInput.disabled = true;
            this.joinButton.disabled = true;
        }
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message && this.username) {
            this.socket.emit('chatMessage', message);
            this.messageInput.value = '';
        }
    }
    
    handleTyping() {
        if (this.username) {
            this.socket.emit('typing');
        }
    }
    
    addMessage(messageObj) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${messageObj.username === this.username ? 'sent' : 'received'}`;
        
        const usernameElement = document.createElement('div');
        usernameElement.className = 'message-username';
        usernameElement.textContent = messageObj.username;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        contentElement.textContent = messageObj.message;
        
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        timeElement.textContent = new Date(messageObj.time).toLocaleTimeString('sl-SI');
        
        messageElement.appendChild(usernameElement);
        messageElement.appendChild(contentElement);
        messageElement.appendChild(timeElement);
        
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    addSystemMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message system';
        messageElement.textContent = message;
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    updateOnlineUsers(count) {
        this.onlineUsersElement.textContent = `Aktivni uporabniki: ${count}`;
    }
}

// Initialize chat when page loads
window.addEventListener('load', () => {
    new Chat();
});
