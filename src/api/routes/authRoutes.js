const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { cleanupExpiredSessions } = require('../../scripts/cleanupSessions');

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);
router.post('/cleanup-sessions', async (req, res) => {
    await cleanupExpiredSessions();
    res.send('Session cleanup initiated.');
  });

module.exports = router;
