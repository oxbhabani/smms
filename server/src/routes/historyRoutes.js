// History routes — fetch maintenance/work history

const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/history - Get history records (auth required)
router.get('/', authMiddleware, getHistory);

module.exports = router;
