const mongoose = require('mongoose');

const db_url = process.env.MONGODB_URL; // Your MongoDB URI
const MAX_RETRIES = 5; // Maximum number of retries

async function connectToMongoDB(retries = MAX_RETRIES) {
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`⚡️[database]: Database is running at ${db_url}`);
    } catch (err) {
        if (retries > 0) {
            console.log(`❌[ERROR]: Failed to connect to MongoDB at ${db_url}. Retrying in 5 seconds...`);
            setTimeout(() => connectToMongoDB(retries - 1), 5000);
        } else {
            console.log(`❌[ERROR]: Failed to connect to MongoDB after ${MAX_RETRIES} attempts.`);
            console.error(err);
            process.exit(1); // Optional: Exit process if unable to connect
        }
    }
}

module.exports = connectToMongoDB;
