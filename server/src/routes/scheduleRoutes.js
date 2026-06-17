const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/scheduleController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.route('/')
  .get(authMiddleware, getSchedules)
  .post(authMiddleware, adminMiddleware, createSchedule);

router.route('/:id')
  .put(authMiddleware, adminMiddleware, updateSchedule)
  .delete(authMiddleware, adminMiddleware, deleteSchedule);

module.exports = router;
