// Mebaselassie Kidane Kebede, mebkeb-0

// Importing necessary modules
const express = require('express');
const mysql = require ('mysql');
const cors = require('cors');

// Initializing Express app
const app = express();

// Middleware setup
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require('bcrypt');
const {response, request} = require("express");
const saltRounds = 10

// Configuring middleware
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true // Allow cookies to be sent and received
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET');
      return res.status(200).json({});
    }
    next();
  });

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

// Session configuration
app.use(session({
    key: "idUser",
    secret: "Hus Index användare",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24, // Session expiration time (in seconds)
    },
}));

// Web sockets
//const http = require("http");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// To store user messages
let userMessages = []
io.on("connection", (socket) => {
    //console.log(socket);
    console.log(`User connected: ${socket.id}`);

    // Send initial messages to the connected client
    socket.emit('userMessages', userMessages);

    // Listen for incoming messages
    socket.on('messages', (message) => {
       // userMessages.push({ ...message, id: socket.id});
        userMessages.push(message);
        console.log(userMessages);
        //console.log(socket.id);

        // Send updated user messages to all clients
        io.emit('userMessages', userMessages);

        // Cleanup on disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });

        // Refresh the messages for all clients every 5 seconds
       const interval = setInterval(() => {
            socket.emit('userMessages', userMessages);
        }, 5000);

        socket.on('disconnect', () => {
            clearInterval(interval);
        });
    });
});

// Start listening on port 3001 for WebSocket connections
httpServer.listen(3000, () => {
   console.log("WebSocket server is connected.")
})

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
app.listen(8081, () => {
    console.log("API server listening on port 3001");
});

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

// Test endpoint
app.get('/', (re, res) => {
    return res.json('From Backend Side Server')
});

// Start the server
/*app.listen(8081, () => {
    console.log('Server has started..')
});*/