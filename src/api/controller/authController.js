const { generateTokens, verifyRefreshToken } = require('../services/tokenService');
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Prepare user data for response, excluding the password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      // Add other fields as needed, but exclude sensitive information
    };

    // Ideally, store the refreshToken in the database or a secure storage associated with the user here

    // Include user data in the response along with the tokens
    res.json({ accessToken, refreshToken, user: userData });
  } catch (error) {
    console.error(`Login Error: ${error.message}`);
    res
      .status(500)
      .json({ message: "Authentication failed due to an internal error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, verify that the refresh token matches the one stored in the database

    const { accessToken, newRefreshToken } = generateTokens(user);
    // Update the refresh token in the database if necessary

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid Refresh Token" });
  }
};
