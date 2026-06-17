const Schedule = require('../models/Schedule');
const Machine = require('../models/Machine');
const logActivity = require('../utils/logger');

const createSchedule = async (data, userId) => {
  const schedule = await Schedule.create(data);
  await schedule.populate('machine');
  logActivity(userId, 'Schedule created');
  return schedule;
};

const updateSchedule = async (id, data) => {
  const schedule = await Schedule.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('machine');
  if (!schedule) {
    throw new Error('Schedule not found');
  }
  return schedule;
};

const getSchedules = async () => {
  return Schedule.find().populate('machine');
};

const deleteSchedule = async (id, userId) => {
  const schedule = await Schedule.findByIdAndDelete(id);
  if (!schedule) {
    throw new Error('Schedule not found');
  }
  logActivity(userId, 'Schedule deleted');
  return schedule;
};

module.exports = { createSchedule, updateSchedule, getSchedules, deleteSchedule };
