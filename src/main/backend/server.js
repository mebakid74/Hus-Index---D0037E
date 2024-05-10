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
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true // Allow cookies to be sent and received
}));

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
        if(err) return res.json(err)
        return res.json(data)
    })
})

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
app.listen(8081, () => {
    console.log('Server has started..')
});