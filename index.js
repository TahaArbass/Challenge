const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const baseUrl = process.env.BASE_URL;

// use base url for all routes
app.use(baseUrl, require('./routes/playerRoutes'));

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });

const port = process.env.PORT || 3000; // default port is 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

