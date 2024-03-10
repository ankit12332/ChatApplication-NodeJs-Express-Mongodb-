const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  loggedInAt: {
    type: Date,
    default: Date.now,
  },
  loggedOutAt: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true, // Sessions are active when created
  },
  // Optionally, record when a session is marked as inactive
  deactivatedAt: Date,
});

module.exports = mongoose.model('Session', sessionSchema);
