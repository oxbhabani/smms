const express = require('express');
const router = express.Router();
const {
  createWorkOrder,
  getWorkOrders,
  getWorkOrder,
  assignTechnician,
  updateStatus,
  deleteWorkOrder,
} = require('../controllers/workOrderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.route('/')
  .get(authMiddleware, getWorkOrders)
  .post(authMiddleware, createWorkOrder);

router.route('/:id')
  .get(authMiddleware, getWorkOrder)
  .delete(authMiddleware, adminMiddleware, deleteWorkOrder);

router.put('/:id/assign', authMiddleware, adminMiddleware, assignTechnician);
router.put('/:id/status', authMiddleware, updateStatus);

module.exports = router;
