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

router.route('/')
  .get(authMiddleware, getMachines)
  .post(authMiddleware, adminMiddleware, createMachine);

router.route('/:id')
  .get(authMiddleware, getMachine)
  .put(authMiddleware, adminMiddleware, updateMachine)
  .delete(authMiddleware, adminMiddleware, deleteMachine);

module.exports = router;
