// Auth routes — register, login, and get current user

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST /api/auth/register - Create a new account (anyone can access)
router.post('/register', register);

// POST /api/auth/login - Log in with credentials (anyone can access)
router.post('/login', login);

// GET /api/auth/me - Get the currently logged-in user (requires auth)
router.get('/me', authMiddleware, getMe);

module.exports = router;
