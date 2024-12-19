const WebSocket = require('ws');

const port = 3000

const server = new WebSocket.Server({ port });
const clients = new Map();
let userIndex = 0;

server.on('connection', (ws) => {
    userIndex++;
    const nickname = `user#${String(userIndex).padStart(3, '0')}`;
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

    clients.set(ws, { nickname, color });

    const message = `${nickname} joined the chat.`
    console.log(message);
    broadcast(message, nickname, color);

    ws.on('message', (data) => {
        const message = JSON.parse(data).message;
        console.log(`[${nickname}]: ${message}`);
        broadcast(message, nickname, color);
    });

    ws.on('close', () => {
        const user = clients.get(ws);
        const message = `${user.nickname} left the chat.`
        console.log(message);
        broadcast(message, user.nickname, user.color);
        clients.delete(ws);
    });

    ws.on('error', (error) => console.error('WebSocket error:', error));
});

function broadcast(message, nickname, color) {
    const data = JSON.stringify({ message, nickname, color });
    clients.forEach((_, client) => {
        if (client.readyState !== WebSocket.OPEN) return
        client.send(data);
    });
}

console.log(`Chat server available at: ws://localhost:${port}`);
