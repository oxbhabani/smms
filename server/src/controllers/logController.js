const logService = require('../services/logService');

const getLogs = async (req, res) => {
  try {
    const logs = await logService.getLogs(req.query);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getLogs };
