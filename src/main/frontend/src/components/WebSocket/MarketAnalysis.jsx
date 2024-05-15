import React, { useState, useEffect } from 'react';
import './MarketAnalysis.css';
import { io } from 'socket.io-client';
import Input from './Input.jsx';
import BidChart from "./BidChart.jsx";

const MarketAnalysis = () => {
    const [message, setMessage] = useState({});
    const [messages, setMessages] = useState([]);

    const [houses, setHouses] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState('');

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

        // Fetch houses from the server
        fetch('http://localhost:3001/list_analysis')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response fail');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched houses:', data);
                setHouses(data);
            })
            .catch(error => console.error('Error fetching houses:', error));

        // Cleanup on component unmount
        return () => {
            socket.off('connect');
            socket.off('userMessages');
        };
    }, [socket]);

    // Function to emit messages
   /* const placeBet = () => {
        socket.emit('messages', message);
    };*/
    const placeBet = () => {
        if (selectedHouse) {
            const bet = { ...message, houseId: selectedHouse };
            socket.emit('messages', bet);
        } else {
            alert("Vänligen väl en fastighet för att lägg bud");
        }
    };

    const filteredMessages = messages.filter(message => message.houseId === selectedHouse);

    return (
        <section className="hero-wrapper">
            <div>
                <h1 className="primaryText">Fastigheter budgivning</h1>

                <div className="filter flexCenter r-head">
                    <select onChange={(e) =>
                        setSelectedHouse(e.target.value)} value={selectedHouse}>

                        <option value="" disabled>Välj fastighet..</option>

                        {houses.map((house, index) => (
                            <option key={index} value={house.ZipCode}>
                                {house.ZipCode} - {house.SalePrice} - {house.DocumentDate} - {house.SqFtTotLiving}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter flexCenter r-head">
                    <Input id="id" placeholder="Ange användar-ID.." handleInput={handleInput} />
                </div>

                <div className="filter flexCenter r-head">
                    <Input id="amount" placeholder="Lägg bud summan.." handleInput={handleInput} />
                </div>

                <button className="button" onClick={placeBet}>Godkänd</button>

                {messages.length > 0 ? (
                    <>
                        {/* <BidChart bids={messages.filter(message => message.houseId === selectedHouse)} /> */}
                    <BidChart bids={filteredMessages} />
                    <table>
                    <thead>
                    <tr>
                        <th>Fastighet ID</th>
                        <th>Nuvarande bud summa</th>
                        <th>Fastighet försäljningspris</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMessages.map((message, index) => (
                        <tr className="secondaryText" key={index}>
                            <td>{message.id}</td>
                            <td>{message.amount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>)
                    </>
                ): (
                    <></>
                    )}
            </div>
        </section>
    );
};

export default MarketAnalysis;
