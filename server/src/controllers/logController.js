// Handles fetching system/activity logs

const logService = require('../services/logService');

// @desc   Get system logs (with optional filters)
// @route  GET /api/logs
// @access Private
const getLogs = async (req, res) => {
  try {
    const logs = await logService.getLogs(req.query);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getLogs };
