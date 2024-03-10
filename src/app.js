require("dotenv").config();
const express = require("express");
const userRoutes = require("./api/routes/userRoutes");
const authRoutes = require("./api/routes/authRoutes");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api", authRoutes);

module.exports = app;
