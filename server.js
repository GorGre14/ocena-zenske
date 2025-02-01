const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 10000;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Store connected users
const users = new Set();
const messages = [];

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected');

    // Handle user join
    socket.on('join', (username) => {
        socket.username = username;
        users.add(username);
        io.emit('userJoined', { username, userCount: users.size });
        socket.emit('previousMessages', messages);
    });

    // Handle chat message
    socket.on('chatMessage', (message) => {
        const messageObj = {
            username: socket.username,
            message: message,
            time: new Date()
        };
        messages.push(messageObj);
        if (messages.length > 100) messages.shift(); // Keep only last 100 messages
        io.emit('newMessage', messageObj);
    });

    // Handle typing
    socket.on('typing', () => {
        socket.broadcast.emit('userTyping', socket.username);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username);
            io.emit('userLeft', { username: socket.username, userCount: users.size });
        }
        console.log('User disconnected');
    });
});

// Start server
http.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
