const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

const verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
};

module.exports = { generateTokens, verifyRefreshToken };
