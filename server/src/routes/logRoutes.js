// Log routes — fetch system/activity logs

const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/logs - Get system logs (auth required)
router.get('/', authMiddleware, getLogs);

module.exports = router;
