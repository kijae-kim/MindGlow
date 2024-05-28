const socket = new WebSocket('ws://localhost:3000');

// Extract the room ID from the URL
// const room = window.location.pathname.split('/').pop();
// socket.emit('join room', room);

document.getElementById('send-button').addEventListener('click', () => {
    const senderInput = document.getElementById('sender-input');
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const sender = senderInput.value || 'Anonymous';

    if (message) {
        const msg = { sender, message, room };
        socket.emit('chat message', msg);
        displayMessage(msg, 'my-message');
        messageInput.value = '';
    }
});

socket.onmessage('chat message', (msg) => {
    const msg = JSON.parse(event.data);
    displayMessage(msg, 'user-message');
});

// socket.on('previous messages', (messages) => {
//     messages.forEach((msg) => {
//         displayMessage(msg, 'user-message');
//     });
// });

function displayMessage(msg, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerHTML = `<strong>${msg.sender}:</strong> ${msg.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fetch previous messages for the room
fetch(`/api/messages/${room}`)
    .then(response => response.json())
    .then(messages => {
        socket.emit('previous messages', messages);
    })
    .catch(error => console.error('Error fetching previous messages:', error));
