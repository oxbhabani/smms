const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action) => {
  try {
    await ActivityLog.create({ user: userId, action });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = logActivity;
