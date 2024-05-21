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
      socket.on('message1', (roomName, updatedBid) => {
        // Handle the received bid message here
        setHouseBids(prevBids => ({
          ...prevBids,
          [roomName]: [...(prevBids[roomName] || []), updatedBid]
        }));
      });
    }
    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  


  useEffect(() => {
    if (socket && selectedRoom !== "") {
      socket.emit('subscribeToBids', selectedRoom);
    }
  
    return () => {
      // Clean up the subscription when socket or selectedRoom changes
      if (socket && selectedRoom !== "") {
        socket.off('bidsUpdate');
      }
    };
  }, [socket, selectedRoom]);



  useEffect(() => {
    if (socket && selectedRoom !== "") {
      // Listen for bid updates
      socket.emit('subscribeToBids', selectedRoom);
      socket.on('bidsUpdate', (roomName, bids) => {
        setHouseBids(prevBids => ({
          ...prevBids,
          [roomName]: bids
        }));
      });
    }
  }, [socket, selectedRoom]);

  
  
  

  const handleChange = (event) => {
    if (socket) {
      socket.emit('subscribeToBids', selectedRoom);
      socket.emit('joinRoom', event.target.value);
      setSelectedRoom(event.target.value);

    }
  };

  const handleSendMessage = () => {
    if (socket) {
      const bidInput = document.getElementById('bid');
      const emailInput = document.getElementById('email');
      const bid = bidInput.value.trim();
      const email = emailInput.value.trim();
      const isNewBidHigher = isHigherBid(bid);

      if (isNewBidHigher) {
        const messageData = {
          bid,
          email,
        };
        socket.emit('message', messageData, selectedRoom);
        bidInput.value = ''; // Clear input after sending
        emailInput.value = ''; // Clear input after sending
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
                {houseBids[selectedRoom].reverse().map((bid) => (
                  <li key={bid.userId}>
                    Budgivare: {bid.userId}
                    Bud: {bid.bid}
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