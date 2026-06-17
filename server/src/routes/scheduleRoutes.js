// Schedule routes — create, read, update, delete schedules

const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/scheduleController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// GET  /api/schedules   - List all schedules (auth required)
// POST /api/schedules   - Create a schedule (admin only)
router.route('/')
  .get(authMiddleware, getSchedules)
  .post(authMiddleware, adminMiddleware, createSchedule);

// PUT    /api/schedules/:id - Update a schedule (admin only)
// DELETE /api/schedules/:id - Delete a schedule (admin only)
router.route('/:id')
  .put(authMiddleware, adminMiddleware, updateSchedule)
  .delete(authMiddleware, adminMiddleware, deleteSchedule);

module.exports = router;
