require('dotenv').config();
const express = require('express');
const connectToMongoDB = require('./config/db');
const startServer = require('./config/startServer')
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to Database
connectToMongoDB();

app.use(express.json());
app.use('/api/users', userRoutes);

// Start the server
startServer(app);

