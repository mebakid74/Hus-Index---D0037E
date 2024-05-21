import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react'
import "swiper/css"
import {sliderSettings} from "../../utils/dataCommon.js";
import data from '../../utils/data.json'

const MarketAnalysis = () => {
  // State variables
  const [socket, setSocket] = useState(null);
  const [houseBids, setHouseBids] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");

  // Toggle login status
  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    console.log(isLoggedIn);
  };

  // Establish socket connection on component mount
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Clean up socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

   // Listen for socket events
  useEffect(() => {
    if (socket) {
       // Listen for bids update
      socket.on('bidsUpdate', (roomName, bids) => {
        console.log('Received bidsUpdate:', roomName, bids);
        setHouseBids(prevBids => ({
          ...prevBids,
          [roomName]: bids
        }));
      });

       // Listen for new bid
      socket.on('newBid', (roomName, updatedBid) => {
        setHouseBids(prevBids => ({
          ...prevBids,
          [roomName]: [...(prevBids[roomName] || []), updatedBid]
        }));
      });
    }

    // Clean up socket event listeners on component unmount or when socket changes
    return () => {
      if (socket) {
        socket.off('bidsUpdate');
        socket.off('newBid');
      }
    };
  }, [socket]);

  // Subscribe to bids for the selected room
  useEffect(() => {
    if (socket && selectedRoom !== "") {
      socket.emit('subscribeToBids', selectedRoom);
    }
  }, [socket, selectedRoom]);

  // Handle room selection change
  const handleChange = (event) => {
    if (socket) {
      const newRoom = event.target.value;
      setSelectedRoom(newRoom);
      socket.emit('joinRoom', newRoom);
      socket.emit('subscribeToBids', newRoom)
    }
  };

   // Handle sending a new bid message
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

  // Check if the new bid is higher than the current highest bid
  function isHigherBid(newBid) {
    const highestBid = houseBids[selectedRoom]?.slice(-1)[0]?.bid || -Infinity;
    return newBid > highestBid;
  }

  // Slider buttons component - lab2 
  const SliderButtons = () => {
    const swiper = useSwiper();
    return (
        <div className = "flexCenter r-buttons">
            <button onClick={() => swiper.slidePrev()}>&lt;</button>
            <button onClick={() => swiper.slideNext()}>&gt;</button>
        </div>
      )
    }

  
  return (
    <div className= "paddings innerWidth r-container">

      <div  className='primaryText paddings innerWidth flexCenter2 hero-container'>
          <h1 className='primaryText'>Marknadsanalys</h1>
      </div>

      <div>
              <Swiper {...sliderSettings}>
                    <SliderButtons />
                    {data.map((property, index) => (
                        <SwiperSlide key={index}>
                            <div className="flexColStart r-card">
                                <img src={property.image} alt={property.name} />

                                <span className="secondaryText r-price">
                                    <span style = {{color: "orange"}}>$</span>
                                    {property.price}
                                </span>

                                <span className="primaryText">{property.name}</span>
                                <span className="secondaryText">{property.detail}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
      </div>

      <div className = "filter flexCenter r-head">
      <select value={selectedRoom} onChange={handleChange}>
        <option value="" disabled>Välj en fastighet</option>
        <option value="1">Fastighet 1</option>
        <option value="2">Fastighet 2</option>
        <option value="3">Fastighet 3</option>
        <option value="4">Fastighet 4</option>
        <option value="5">Fastighet 5</option>
      </select>
      </div>

      <div className = "r-head flexColStart">
        {selectedRoom && (
          <>
           <div className = "r-head flexColStart">
            <h3 className = "primaryText">Högsta bud: $ {houseBids[selectedRoom]?.slice(-1)[0]?.bid}</h3>
            </div>

            <div className = "r-head flexColStart">
            <h4 className = "orangeText">Budhistorik:</h4>
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
            </div>
          </>
        )}
        
     </div>

      <div className = "filter flexCenter r-head flexColStart">
        <form className="form hero-wrapper">

        <div  className="form-group">
        <input 
        type="text" 
        id="bid" 
        name="bid" 
        placeholder="Ange ditt bud" required />
        </div>


        <div className="form-group">
        <input 
        type="email" 
        id="email" 
        name="email" 
        placeholder="Skriv in din mailadress" required />
        </div>


        <button className="button" type="button" onClick={handleSendMessage}>Skicka Bud</button>

      </form>

      <button className="button" onClick={handleLogin}>{isLoggedIn ? "Admin logga ut" : "Admin Logga in"}</button>
      </div>
     
    </div>
  );
};

export default MarketAnalysis;
