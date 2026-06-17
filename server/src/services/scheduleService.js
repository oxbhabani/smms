// scheduleService.js — CRUD operations for maintenance schedules

const Schedule = require('../models/Schedule');
const Machine = require('../models/Machine');
const logActivity = require('../utils/logger');

// Create a new schedule entry and log the action
const createSchedule = async (data, userId) => {
  const schedule = await Schedule.create(data);
  await schedule.populate('machine');
  logActivity(userId, 'Schedule created');
  return schedule;
};

// Update an existing schedule by ID
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

// Retrieve all schedules with related machine data
const getSchedules = async () => {
  return Schedule.find().populate('machine');
};

// Delete a schedule by ID and log the action
const deleteSchedule = async (id, userId) => {
  const schedule = await Schedule.findByIdAndDelete(id);
  if (!schedule) {
    throw new Error('Schedule not found');
  }
  logActivity(userId, 'Schedule deleted');
  return schedule;
};

module.exports = { createSchedule, updateSchedule, getSchedules, deleteSchedule };
