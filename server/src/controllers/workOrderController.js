const workOrderValidator = require('../validators/workOrderValidator');
const workOrderService = require('../services/workOrderService');

const createWorkOrder = async (req, res) => {
  try {
    const { errors } = workOrderValidator.validateCreateWorkOrder(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }
    const workOrder = await workOrderService.createWorkOrder(req.body, req.user.id);
    res.status(200).json({ success: true, data: workOrder });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const assignTechnician = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Only admins can assign technicians' });
    }
    const workOrder = await workOrderService.assignTechnician(req.params.id, req.body.technicianId, req.user.id);
    res.status(200).json({ success: true, data: workOrder });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    if (req.user.role === 'Technician') {
      const workOrder = await workOrderService.getWorkOrderById(req.params.id);
      if (!workOrder || workOrder.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this work order' });
      }
    }
    const updated = await workOrderService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getWorkOrders = async (req, res) => {
  try {
    const workOrders = await workOrderService.getWorkOrders(req.query);
    res.status(200).json({ success: true, data: workOrders });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getWorkOrder = async (req, res) => {
  try {
    const workOrder = await workOrderService.getWorkOrderById(req.params.id);
    res.status(200).json({ success: true, data: workOrder });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const deleteWorkOrder = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Only admins can delete work orders' });
    }
    const workOrder = await workOrderService.deleteWorkOrder(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: workOrder });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { createWorkOrder, assignTechnician, updateStatus, getWorkOrders, getWorkOrder, deleteWorkOrder };
