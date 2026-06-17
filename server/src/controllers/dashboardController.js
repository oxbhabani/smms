// Handles dashboard statistics

const dashboardService = require('../services/dashboardService');

// @desc   Get dashboard stats (counts, summaries)
// @route  GET /api/dashboard
// @access Private
const getStats = async (req, res) => {
  try {
    const stats = await dashboardService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats };
