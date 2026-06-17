// Handles user-related queries

const userService = require('../services/userService');

// @desc   Get all users (optionally filtered by role)
// @route  GET /api/users
// @access Private
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await userService.getUsers(role);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers };
