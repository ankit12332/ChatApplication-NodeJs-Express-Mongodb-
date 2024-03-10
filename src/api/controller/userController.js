const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const UserDto = require("../../dtos/userDto");

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Failed to hash password");
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`getUser Error: ${error.message}`);
    res.status(500).json({ error: true, message: "Failed to retrieve user" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(`getAllUsers Error: ${error.message}`);
    res.status(500).json({ error: true, message: "Failed to retrieve users" });
  }
};

exports.createUser = async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "Email already exists" });
    }

    const userDto = new UserDto(req.body);
    userDto.password = await hashPassword(userDto.password);
    let user = new User(userDto);
    user = await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(`createUser Error: ${error.message}`);
    res.status(500).json({ error: true, message: "Failed to create user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    const userDto = new UserDto(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, userDto, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`updateUser Error: ${error.message}`);
    res.status(500).json({ error: true, message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`deleteUser Error: ${error.message}`);
    res.status(500).json({ error: true, message: "Failed to delete user" });
  }
};
