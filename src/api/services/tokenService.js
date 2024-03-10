const jwt = require('jsonwebtoken');
const Session = require('../../models/sessionModel');

const generateTokens = async (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Adjusted expiration
  
    const session = new Session({
      userId: user._id,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      active: true,
    });
    await session.save();
  
    return { accessToken, refreshToken };
  };

  const verifyRefreshToken = async (refreshToken) => {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { ignoreExpiration: true });
    const session = await Session.findOne({
      userId: payload.id,
      refreshToken: refreshToken,
      expiresAt: { $gte: new Date() },
      active: true
    });

    if (!session) {
      throw new Error('Refresh token not found, invalid, or expired');
    }

    // Implement refresh token rotation
    const newRefreshToken = jwt.sign({ id: payload.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const expiresAt = new Date(Date.now() + expiresIn);

    // Update the session with the new refresh token and expiration date
    session.refreshToken = newRefreshToken;
    session.expiresAt = expiresAt;
    await session.save();

    const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    return { accessToken, newRefreshToken };
};


module.exports = { generateTokens, verifyRefreshToken };
