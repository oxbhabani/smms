// historyService.js — Retrieve completed maintenance history records

const History = require('../models/History');

// Fetch all history entries with related machine, technician, and work order data
const getHistory = async () => {
  return History.find().populate(['machine', 'technician', 'workOrder']);
};

module.exports = { getHistory };
