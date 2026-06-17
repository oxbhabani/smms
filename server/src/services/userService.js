// userService.js — Retrieve user accounts

const User = require('../models/User');

// Fetch all users, optionally filtered by role, excluding password hashes
const getUsers = async (role) => {
  const filter = role ? { role } : {};
  return User.find(filter).select('-passwordHash');
};

module.exports = { getUsers };
