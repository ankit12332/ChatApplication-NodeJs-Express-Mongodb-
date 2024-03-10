const { generateTokens, verifyRefreshToken } = require('../services/tokenService');
const User = require('../../models/userModel');
const Session = require('../../models/sessionModel');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check for existing active sessions
    const existingSession = await Session.findOne({ userId: user._id, active: true });
    if (existingSession) {
      // If an active session exists, return the existing refreshToken with a message
      return res.status(400).json({ 
        message: "User already logged in. Please logout before logging in again.",
        refreshToken: existingSession.refreshToken // Provide the existing refresh token for logout
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    res.json({ accessToken, refreshToken, user: userData });
  } catch (error) {
    console.error(`Login Error: ${error.message}`);
    res.status(500).json({ message: "Authentication failed due to an internal error" });
  }
};


exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const session = await Session.findOne({ refreshToken, active: true });

    if (!session) {
      return res.status(400).json({ message: "Session not found or already inactive" });
    }

    // Mark the session as inactive and set both loggedOutAt and deactivatedAt fields
    session.active = false;
    session.loggedOutAt = new Date(); // Record the time of logout
    session.deactivatedAt = new Date(); // Optionally, record the same or different time as session deactivation time

    await session.save();

    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error(`Logout Error: ${error}`);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};




exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    const { accessToken, newRefreshToken } = await verifyRefreshToken(refreshToken);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    res.status(401).json({ message: "Invalid Refresh Token" });
  }
};