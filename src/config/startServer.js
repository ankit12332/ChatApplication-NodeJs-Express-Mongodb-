const MAX_RETRIES = 5;
const port = process.env.PORT || 3000;

const api_url =
    process.env.NODE_ENV === "production"
        ? process.env.API_URL
        : `http://localhost:${port}`;

function startServer(app, retries = MAX_RETRIES) {
    app
        .listen(port, () => {
            console.log(`⚡️[server]: Server is running at ${api_url}`);
        })
        .on("error", (err) => {
            if (retries > 0) {
                console.log(`❌[ERROR]: Server failed to start. Retrying...`);
                setTimeout(() => startServer(app, retries - 1), 5000); // Change port to server
            } else {
                console.log(
                    `❌[ERROR]: Failed to start server after ${MAX_RETRIES} attempts.`
                );
                console.log(err);
            }
        });
}

module.exports = startServer;
