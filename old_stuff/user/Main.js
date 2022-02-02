/*
require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const Router = require('./Router');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;

const cors = require('cors')
app.use(cors()) // Use this after the variable declaration

app.use(express.static(path.join(__dirname, 'build'))); // telling express to service our build folder
app.use(express.json()); // telling express that we want to use json for sending and receiving data
app.use(bodyParser.urlencoded({extended: true}));


// Creating the database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
db.on('connection', (connection) => {
    console.log("DB Connection established", connection);

    connection.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });
});


// middleware that checks if JWT token exists and verifies it if it does exist.
// In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    let token = req.headers['authorization'];
    if (!token) return next(); //if no token, continue

    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) {
            return res.status(401).json({
                error: true,
                message: "Invalid user."
            });
        } else {
            req.user = user; //set the user to req so other routes can use it
            next();
        }
    });
});

app.listen(port, () => {
    console.log('Server started on: ' + port);
});

new Router(app, db);*/
