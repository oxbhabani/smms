const userService = require('../services/userService');

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
