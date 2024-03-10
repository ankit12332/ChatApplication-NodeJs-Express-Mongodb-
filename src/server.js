require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = require("./app"); // Import the Express application

const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGODB_URL; // Your MongoDB URI
const maxRetries = 5;
let retries = maxRetries;

async function connectToMongoDB() {
  try {
    await mongoose.connect(dbUrl); // Removed deprecated options
    console.log(`⚡️[database]: Database is running at ${dbUrl}`);
  } catch (err) {
    console.log(
      `❌[ERROR]: Failed to connect to MongoDB at ${dbUrl}. Retrying in 5 seconds...`
    );
    if (retries > 0) {
      setTimeout(connectToMongoDB, 5000, --retries);
    } else {
      console.log(
        `❌[ERROR]: Failed to connect to MongoDB after ${maxRetries} attempts.`
      );
      process.exit(1);
    }
  }
}

function startServer() {
  app
    .listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    })
    .on("error", (err) => {
      if (retries > 0) {
        console.log(`❌[ERROR]: Server failed to start. Retrying...`);
        setTimeout(startServer, 5000, --retries);
      } else {
        console.log(
          `❌[ERROR]: Failed to start server after ${maxRetries} attempts.`
        );
        console.error(err);
      }
    });
}

// Connect to Database and Start the server
startServer();
connectToMongoDB();
