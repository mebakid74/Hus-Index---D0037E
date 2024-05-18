import React, { useState } from 'react';
import { io } from 'socket.io-client';

const MarketAnalysis = () => {
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const connectToSocket = () => {
        const newSocket = io('http://localhost:3000'); 
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        newSocket.on('chatMessage', (data) => {
            console.log(`Message received: ${data.message}`);
            setMessages([...messages, data]); // Add the received message to the message list
        });
    };

    const joinRoom = () => {
        if (socket) {
            socket.emit('joinRoom', room);
            console.log(`Joined room: ${room}`);
        }
    };

    const leaveRoom = () => {
        if (socket) {
            socket.emit('leaveRoom', room);
            console.log(`Left room: ${room}`);
        }
    };

    const sendMessage = () => {
        if (socket) {
            socket.emit('chatMessage', { room, message }); // Send the message to the server
            setMessage(''); // Clear the message input field
        }
    };

    return (
        <div>
            <select value={room} onChange={(e) => setRoom(e.target.value)}>
                <option value="">Select a room</option>
                <option value="1">Room 1</option>
                <option value="2">Room 2</option>
                <option value="3">Room 3</option>
                <option value="4">Room 4</option>
                <option value="5">Room 5</option>
            </select>
            <button onClick={connectToSocket}>Connect</button>
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={leaveRoom}>Leave Room</button>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg.user}: {msg.message}
                    </div>
                ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default MarketAnalysis;