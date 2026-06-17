const ActivityLog = require('../models/ActivityLog');

const getLogs = async () => {
  return ActivityLog.find().populate('user').sort({ createdAt: -1 });
};

module.exports = { getLogs };
