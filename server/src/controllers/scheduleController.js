const scheduleValidator = require('../validators/scheduleValidator');
const scheduleService = require('../services/scheduleService');

const createSchedule = async (req, res) => {
  try {
    const { errors } = scheduleValidator.validateCreateSchedule(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }
    const schedule = await scheduleService.createSchedule(req.body, req.user.id);
    res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { errors } = scheduleValidator.validateUpdateSchedule(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.getSchedules();
    res.status(200).json({ success: true, data: schedules });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.deleteSchedule(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { createSchedule, updateSchedule, getSchedules, deleteSchedule };
