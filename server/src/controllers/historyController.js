const historyService = require('../services/historyService');

const getHistory = async (req, res) => {
  try {
    const history = await historyService.getHistory(req.query);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getHistory };
