// Activity logger — saves a log entry to the database for a user action
const ActivityLog = require('../models/ActivityLog');

// Creates a new activity record in the DB (silently logs errors to console)
const logActivity = async (userId, action) => {
  try {
    await ActivityLog.create({ user: userId, action });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = logActivity;
