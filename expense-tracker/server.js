const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let expenses = [];
const { v4: uuidv4 } = require('uuid');

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  socket.emit('init', expenses);

  socket.on('addExpense', (expense) => {
    // attach id and createdAt for management
    const item = Object.assign({}, expense, { id: uuidv4(), createdAt: new Date().toISOString() });
    expenses.push(item);
    io.emit('update', expenses);
  });
  
  socket.on('removeExpense', (id) => {
    expenses = expenses.filter(e => e.id !== id);
    io.emit('update', expenses);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
