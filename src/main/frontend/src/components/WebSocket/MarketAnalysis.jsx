import React, { useState } from 'react';
import { io } from 'socket.io-client';

const MarketAnalysis = () => {
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    // const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const [bids, setBids] = useState([]);
    const [highestBid, setHighestBid] = useState(0);

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
            // setMessages([...messages, data]); // Add the received message to the message list
            setHighestBid(data.highestBid);
            setBids(data.bids);
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
      /*  if (socket) {
            socket.emit('chatMessage', { room, message }); // Send the message to the server
            setMessage(''); // Clear the message input field
        } */
        const bid = parseFloat(message);
        if (socket && !isNaN(bid) && bid > 0) {
            socket.emit('chatMessage', { room, message: bid }); // Send the message to the server
            setMessage(''); // Clear the message input field
        } else {
            alert("Please enter a valid bid");
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
                <h3>Högsta bud: ${highestBid}</h3>
                <h4>Bud historik:</h4>
            </div>

            <div>
                {bids.map((bid, index) => (
                    <div key={index}>
                        {bid.user}: {bid.message}
                    </div>
                ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ange ditt bud" />

            <button onClick={sendMessage}>Skicka</button>
        </div>
    );
};

export default MarketAnalysis;