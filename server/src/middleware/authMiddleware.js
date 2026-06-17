// Authentication & authorization middleware — verifies JWT and checks admin role
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Extracts and verifies JWT from the Authorization header, attaches user to req
const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    // Reject if no Bearer token is present
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = header.split(' ')[1]; // Extract the token part after "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB (exclude password) and attach to request
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next(); // Proceed to the next middleware / route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Restricts route to users with the Admin role
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin access required' });
};

module.exports = { authMiddleware, adminMiddleware };
