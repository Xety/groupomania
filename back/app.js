const dotenv = require("dotenv");
// Initialize dotenv.
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieSession = require("cookie-session");
const db = require("./models");
const authRoutes = require('./routes/auth');


// Set the CORS options.
const corsOptions = {
    credentials: true,
    origin: "http://localhost:4200"
};

//db.sequelize.sync({force: true});
db.sequelize.sync();

const app = express();

// Initialize the CORS with allowed domains.
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
      name: process.env.COOKIE_NAME,
      secret: process.env.COOKIE_SECRET, // should use as secret environment variable
      httpOnly: true
    });
);

// Serve static images.
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', authRoutes);


module.exports = app;