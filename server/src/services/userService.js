const User = require('../models/User');

const getUsers = async (role) => {
  const filter = role ? { role } : {};
  return User.find(filter).select('-passwordHash');
};

module.exports = { getUsers };
