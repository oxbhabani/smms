const History = require('../models/History');

const getHistory = async () => {
  return History.find().populate(['machine', 'technician', 'workOrder']);
};

module.exports = { getHistory };
