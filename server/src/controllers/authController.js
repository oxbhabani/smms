const authValidator = require('../validators/authValidator');
const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { errors } = authValidator.validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }
    const user = await authService.register(req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { errors } = authValidator.validateLogin(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }
    const token = await authService.login(req.body);
    res.status(200).json({ success: true, data: token });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe };
