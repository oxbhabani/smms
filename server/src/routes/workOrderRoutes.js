// Work order routes — create, read, update, delete, assign, change status

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

// GET  /api/work-orders   - List all work orders (auth required)
// POST /api/work-orders   - Create a work order (auth required)
router.route('/')
  .get(authMiddleware, getWorkOrders)
  .post(authMiddleware, createWorkOrder);

// GET    /api/work-orders/:id - Get one work order (auth required)
// DELETE /api/work-orders/:id - Delete a work order (admin only)
router.route('/:id')
  .get(authMiddleware, getWorkOrder)
  .delete(authMiddleware, adminMiddleware, deleteWorkOrder);

// PUT /api/work-orders/:id/assign - Assign a technician (admin only)
router.put('/:id/assign', authMiddleware, adminMiddleware, assignTechnician);

// PUT /api/work-orders/:id/status - Update status (auth required)
router.put('/:id/status', authMiddleware, updateStatus);

module.exports = router;
