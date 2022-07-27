const dotenv = require("dotenv");
// Initialize dotenv.
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require("./models");
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');


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

// Serve static images.
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);


module.exports = app;