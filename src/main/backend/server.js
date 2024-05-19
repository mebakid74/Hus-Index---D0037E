// Mebaselassie Kidane Kebede, mebkeb-0
// Importing necessary modules
const express = require('express');
const mysql = require ('mysql');
const socketIO = require('socket.io');
const cors = require('cors');
const http = require('http');

// Initializing Express app
const app = express();


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

// Configuring middleware
app.use(express.json());

// Keep track of previous bids
const roomHighestBids = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    /* Handle joining a room
    socket.on('joinRoom', (room) => {
        console.log(`User joined room: ${room}`);
        socket.join(room); // Join the specified room
    }); */

    socket.on('joinRoom', (room) => {
        console.log(`User joined room: ${room}`);
        socket.join(room);
        if (!roomHighestBids[room]) {
            roomHighestBids[room] = {
                highestBid: 0,
                bids: []
            };
        }
        // Send the current highest bid and bid history to the user who just joined
        socket.emit('chatMessage', { 
            highestBid: roomHighestBids[room].highestBid,
            bids: roomHighestBids[room].bids});
    });

    // Handle leaving a room
    socket.on('leaveRoom', (room) => {
        console.log(`User left room: ${room}`);
        socket.leave(room); // Leave the specified room
    });

    /* Handle chat messages within a room
    socket.on('chatMessage', (data) => {
        console.log(`Message received in room ${data.room}: ${data.message}`);
        io.to(data.room).emit('chatMessage', data); // Emit the message to all users in the room
    }); */

    socket.on('chatMessage', (data) => {
    const bid = parseFloat(data.message);
    if (bid > roomHighestBids[data.room].highestBid) {
         roomHighestBids[data.room].highestBid = bid;
    }
    roomHighestBids[data.room].bids.push({ message: bid, user: socket.id });
    io.to(data.room).emit('chatMessage', {
        highestBid: roomHighestBids[data.room].highestBid,
        bids: roomHighestBids[data.room].bids
    });
    console.log(`New bid in room ${data.room}: ${bid}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
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

