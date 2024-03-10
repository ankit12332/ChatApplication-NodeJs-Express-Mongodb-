const cron = require("node-cron");
const Session = require("../models/sessionModel");

const cleanupExpiredSessions = async () => {
  try {
    const result = await Session.updateMany(
      {
        expiresAt: { $lt: new Date() },
        active: true, // Ensure we're only trying to deactivate active sessions
      },
      {
        $set: { active: false, deactivatedAt: new Date() },
      }
    );

    // Adjust logging based on actual result structure
    console.log(`Deactivated ${result.nModified || "some"} expired sessions.`);
  } catch (error) {
    console.error("Error during session cleanup:", error);
  }
};

// Running daily at midnight
cron.schedule(
  "0 0 * * *",
  async () => {
    await cleanupExpiredSessions();
    console.log("Expired sessions cleanup executed");
  },
  {
    timezone: "Asia/Kolkata",
  }
);

module.exports = { cleanupExpiredSessions };
