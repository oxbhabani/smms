// logService.js — Retrieve activity log entries

const ActivityLog = require('../models/ActivityLog');

// Fetch all activity logs with user data, newest first
const getLogs = async () => {
  return ActivityLog.find().populate('user').sort({ createdAt: -1 });
};

module.exports = { getLogs };
