import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const MarketAnalysis = () => {
  const [socket, setSocket] = useState(null);
  const [houseBids, setHouseBids] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    console.log(isLoggedIn);
  };

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('bidsUpdate', (roomName, bids) => {
        console.log('Recieved bidsUpdate:', roomName, bids);
        setHouseBids(prevBids => ({
          ...prevBids,
          [roomName]: bids
        }));
      });

      socket.on('newBid', (roomName, updatedBid) => {
        setHouseBids(prevBids => ({
          ...prevBids,
          [roomName]: [...(prevBids[roomName] || []), updatedBid]
        }));
      });
    }

    return () => {
      if (socket) {
        socket.off('bidsUpdate');
        socket.off('newBid');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket && selectedRoom !== "") {
      socket.emit('subscribeToBids', selectedRoom);
    }
  }, [socket, selectedRoom]);

  const handleChange = (event) => {
    if (socket) {
      const newRoom = event.target.value;
      setSelectedRoom(newRoom);
      socket.emit('joinRoom', newRoom);
      socket.emit('subscribeToBids', newRoom);
    }
  };

  const handleSendMessage = () => {
    if (socket) {
      const bidInput = document.getElementById('bid');
      const emailInput = document.getElementById('email');
      const bid = parseFloat(bidInput.value.trim());
      const email = emailInput.value.trim();
      const isNewBidHigher = isHigherBid(bid);

      if (isNewBidHigher) {
        const messageData = {
          bid,
          email,
        };
        socket.emit('message', messageData, selectedRoom);
        bidInput.value = '';
        emailInput.value = '';
      } else {
        // Handle case where new bid is not higher
      }
    } else {
      console.error('Socket connection not established. Message cannot be sent.');
    }
  };

  function isHigherBid(newBid) {
    const highestBid = houseBids[selectedRoom]?.slice(-1)[0]?.bid || -Infinity;
    return newBid > highestBid;
  }

  return (
    <div>
      <h1>Marknadsanalys</h1>
      <select value={selectedRoom} onChange={handleChange}>
        <option value="" disabled>Välj en fastighet</option>
        <option value="1">Fastighet 1</option>
        <option value="2">Fastighet 2</option>
        <option value="3">Fastighet 3</option>
        <option value="4">Fastighet 4</option>
        <option value="5">Fastighet 5</option>
      </select>

      <div>
        {selectedRoom && (
          <>
            <h3>Högsta bud: {houseBids[selectedRoom]?.slice(-1)[0]?.bid}</h3>
            <h4>Budhistorik:</h4>
            {houseBids[selectedRoom] && (
              <ul>
                {houseBids[selectedRoom].map((bid, index) => (
                  <li key={index}>
                    Budgivare: {bid.userId}, Bud: {bid.bid}
                    {isLoggedIn && <span>, Email: {bid.email}</span>}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <form id="messageForm">
        <input type="text" id="bid" name="bid" placeholder="Ange ditt bud" required />
        <input type="email" id="email" name="email" placeholder="Skriv in din mailadress" required />
        <button type="button" onClick={handleSendMessage}>Skicka Bud</button>
      </form>

      <button onClick={handleLogin}>{isLoggedIn ? "Admin logga ut" : "Admin Logga in"}</button>
    </div>
  );
};

export default MarketAnalysis;
