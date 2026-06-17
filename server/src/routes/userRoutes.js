// User routes — fetch user list

const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/users - Get all users (auth required)
router.get('/', authMiddleware, getUsers);

module.exports = router;
