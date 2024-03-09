const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
    let user = new User(req.body);
    user = await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
