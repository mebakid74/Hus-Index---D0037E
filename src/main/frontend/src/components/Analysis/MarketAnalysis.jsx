import React, { useState, useEffect } from 'react';
import './MarketAnalysis.css';
import { io } from 'socket.io-client';
import Input from '../WebSocket/Input.jsx';

const MarketAnalysis = () => {
    const [message, setMessage] = useState({});
    const [messages, setMessages] = useState([]);

    // Initialize socket outside of component to avoid reinitialization
    const socket = io('http://localhost:3000');

    // Handle input changes
    const handleInput = (e) => {
        const { id, value } = e.target;
        setMessage((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Use useEffect to set up socket event listeners
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        socket.on('userMessages', (userMessages) => {
            console.log('Received userMessages:', userMessages);
            setMessages(Array.isArray(userMessages) ? userMessages : []);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('connect');
            socket.off('userMessages');
        };
    }, [socket]);

    // Function to emit messages
    const placeBet = () => {
        socket.emit('messages', message);
    };

    return (
        <section className="hero-wrapper">
            <div>
                <h1 className="primaryText">Fastigheter budgivning</h1>

                <div className="filter flexCenter r-head">
                    <Input id="id" placeholder="Ange fastighet ID.." handleInput={handleInput} />
                </div>

                <div className="filter flexCenter r-head">
                    <Input id="amount" placeholder="Lägg bud summan.." handleInput={handleInput} />
                </div>

                <button className="button" onClick={placeBet}>Godkänd</button>

                {messages.length > 0 ? (
                    <table>
                    <thead>
                    <tr>
                        <th>Fastighet ID</th>
                        <th>Nuvarande bud summa</th>
                        <th>Fastighet försäljningspris</th>
                    </tr>
                    </thead>
                    <tbody>
                    {messages.map((message, index) => (
                        <tr className="secondaryText" key={index}>
                            <td>{message.id}</td>
                            <td>{message.amount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>) : (
                    <></> )}
            </div>
        </section>
    );
};

export default MarketAnalysis;
