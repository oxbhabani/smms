// Dashboard routes — fetch summary statistics

const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/dashboard - Get dashboard stats (auth required)
router.get('/', authMiddleware, getStats);

module.exports = router;
