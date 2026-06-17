// Machine routes — create, read, update, delete machines

const express = require('express');
const router = express.Router();
const {
  createMachine,
  getMachines,
  getMachine,
  updateMachine,
  deleteMachine,
} = require('../controllers/machineController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// GET  /api/machines   - List all machines (auth required)
// POST /api/machines   - Create a machine (admin only)
router.route('/')
  .get(authMiddleware, getMachines)
  .post(authMiddleware, adminMiddleware, createMachine);

// GET    /api/machines/:id - Get one machine (auth required)
// PUT    /api/machines/:id - Update a machine (admin only)
// DELETE /api/machines/:id - Delete a machine (admin only)
router.route('/:id')
  .get(authMiddleware, getMachine)
  .put(authMiddleware, adminMiddleware, updateMachine)
  .delete(authMiddleware, adminMiddleware, deleteMachine);

module.exports = router;
