const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

/**
 * getUserByUsernameAndPassword
 * - Expects req.body: { email, password }
 * - If not found -> 200 + { message: "Invalid Credentials" } (test expects this)
 * - On error -> 500 + { message: error.message }
 */
const getUserByUsernameAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email: (email || "").toLowerCase(), password });

    if (!user) {
      return res.status(200).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET || "TEST_SECRET",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        role: user.role,
        email: user.email,
        phone: user.mobileNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * addUser
 * - Expects req.body with user fields
 * - On success -> 200 + { message: "Success" } (tests expect "Success")
 * - On error -> 500 + { message: error.message }
 */
const addUser = async (req, res) => {
  try {
    await User.create(req.body);
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * getAllUsers
 * - Returns users array or 500 + { message: error.message }
 */
const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserByUsernameAndPassword,
  addUser,
  getAllUsers,
};
