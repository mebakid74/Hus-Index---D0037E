// Mebaselassie Kidane Kebede, mebkeb-0
// Importing necessary modules
const express = require('express');
const mysql = require ('mysql');
const socketIO = require('socket.io');
const cors = require('cors');
const http = require('http');

// Initializing Express app
const app = express();

// Configuring middleware
app.use(express.json());


const wsServer = http.createServer();
const io = socketIO(wsServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

wsServer.listen(3000, () => {
    console.log(`WebSocket Server is running on port 3000`);
});



const roomUserIds = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('joinRoom', (roomName) => {
        socket.leaveAll();
        socket.join(roomName); // Join the specified room
        console.log(`User joined room: ${roomName}`);

        // Optionally, send a welcome message to the user joining the room
        socket.emit('joinedRoom', roomName);

        // Ensure the bids array is initialized for the room
        if (!roomUserIds[roomName]) {
            roomUserIds[roomName] = { nextUserId: 1, bids: [] };
        }

        // Emit the current bids to the new user
        socket.emit('bidsUpdate', roomName, roomUserIds[roomName].bids);
    });


    socket.on('message', (data, roomName) => {
        if (roomName) {
            if (data.bid !== '' && data.email !== '') {
                const { bid, email } = data;

                // Get or create room user ID object
                let roomUserIdsForRoom = roomUserIds[roomName] || { nextUserId: 1, bids: [] }; // Initialize nextUserId and bids
                roomUserIds[roomName] = roomUserIdsForRoom; // Update roomUserIds

                const userEntry = roomUserIdsForRoom[email] || {};
                roomUserIdsForRoom[email] = userEntry; // Update user entry

                // Assign or use existing user ID
                if (!userEntry.userId) {
                    userEntry.userId = roomUserIdsForRoom.nextUserId;
                    roomUserIdsForRoom.nextUserId = roomUserIdsForRoom.nextUserId + 1; // Increment next ID
                     
                }
                userEntry.bidCount = (userEntry.bidCount || 0) + 1; // Increment bid count

                const userId = userEntry.userId;
                const updatedBid = { userId, bid, email };

                // Add the updated bid to the bids array for the room
                roomUserIdsForRoom.bids.push(updatedBid);

                // Broadcast the updated message with the user ID
                io.to(roomName).emit('newBid', roomName, updatedBid);
              
                console.log(`room ${roomName}:`, updatedBid);

            } else {
                console.error("Invalid message format. Missing bid or email data.");
            }
        } else {
            console.error("Missing room name in message.");
        }
    });

    socket.on('subscribeToBids', (roomName) => {
        // Retrieve existing bids for the room (assuming you store them server-side)
        const roomBids = (roomUserIds[roomName] && roomUserIds[roomName].bids) || [];
        console.log(roomName, roomBids, "subscribe");
        // Emit the retrieved bids to the subscribing client
        socket.emit('bidsUpdate', roomName, roomBids);
    });
});   




app.listen(8081, () => {
    console.log("API server listening on port 8081");
});


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET', 'POST');
      return res.status(200).json({});
    }
    next();
  });



// Database connection setup
const db = mysql.createConnection({
    host: "b2956.research.ltu.se",
    user: "d0037e",
    password: "0g3JV2XjEhg4GC12p7%D5a2Xl53u8yLr",
    database: "D0037E_2024",
})

app.get('/list_analysis', (re, res) => {
    //const q = "SELECT * FROM houses"
    const q = "SELECT ZipCode, SalePrice, DocumentDate, SqFtTotLiving FROM HouseSales"
    db.query(q,(err,data) => {
        //if(err) return res.json(err)
        //return res.json(data)
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json(err);
        }
        console.log('Fetched houses:', data);
        return res.json(data);
    })
})

// Start listening on port 3001 for API requests


/*************** Lab 1, 2, 3 stuff **********************/
// Endpoint to fetch all houses
app.get('/lista_av_alla_fastighter', (re, res) => {
    //const q = "SELECT * FROM houses"
    const q = "SELECT * FROM HouseSales LIMIT 25"
    db.query(q,(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// Endpoint to handle user registration
app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Hash the password before storing it in the database
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err)
        }
        // Insert user data into the database
        db.query (
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hash],
            (err, result) => {
                console.log(err); // Log any errors
            }
        );
    });
});

// Endpoint to check if a user is logged in
app.get("/login", (req, res) => {
    if(req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send( { loggedIn: false });
    }
});

// Endpoint to handle user login
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Query to find user by email
    db.query (
        "SELECT * from users WHERE email = ?;",
        email,
        (err, result) => {
            if (err) {
                res.send({ err: err});
            }

            if (result.length > 0) {
                // Compare hashed password with the provided password
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result; // Set user session
                        console.log(req.session.user) // Log user session data
                        res.send(result) // Send user data
                    } else {
                        res.send({ message: "Felaktig mejl eller lösenord"});
                    }
                });
            } else {
                res.send({ message: "Användaren existerar inte!"});
            }
        }
    );
});


app.get('/', (re, res) => {
    return res.json('From Backend Side Server')
});

