const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = (event) => {
    const chat = document.getElementById('chat');
    const newMessage = document.createElement('div');

    const parsedData = JSON.parse(event.data);
    newMessage.innerHTML = `<span style="color: ${parsedData.color}; font-weight: bold;">${parsedData.nickname}:</span> ${parsedData.message}`;

    chat.appendChild(newMessage);
    chat.scrollTop = chat.scrollHeight; 

    if (document.hidden) {
        document.title = `New message from ${parsedData.nickname}`;
    }
};

function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.send(JSON.stringify({ message })); 
        messageInput.value = ''; 
    }
}

socket.onopen = () => {
    console.log('Connection is open');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

socket.onclose = () => {
    console.log('Connection is closed');
};

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        document.title = 'WebSocket chat';
    }
});