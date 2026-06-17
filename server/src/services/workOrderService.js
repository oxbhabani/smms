// workOrderService.js — CRUD operations and status management for work orders

const WorkOrder = require('../models/WorkOrder');
const History = require('../models/History');
const logActivity = require('../utils/logger');

// Create a new work order linked to the requesting user
const createWorkOrder = async (data, userId) => {
  const workOrder = await WorkOrder.create({ ...data, createdBy: userId });
  await workOrder.populate(['machine', 'assignedTo', 'createdBy']);
  logActivity(userId, `Work order created: ${workOrder.title}`);
  return workOrder;
};

// Assign a technician to an existing work order
const assignTechnician = async (id, technicianId, userId) => {
  const workOrder = await WorkOrder.findByIdAndUpdate(
    id,
    { assignedTo: technicianId },
    { new: true, runValidators: true }
  ).populate(['machine', 'assignedTo', 'createdBy']);
  if (!workOrder) {
    throw new Error('Work order not found');
  }
  logActivity(userId, `Technician assigned to work order: ${workOrder.title}`);
  return workOrder;
};

// Update the status of a work order; auto-log completion to history
const updateStatus = async (id, status, userId) => {
  const updateData = { status };
  if (status === 'Completed') {
    updateData.completedAt = new Date();
  }

  const workOrder = await WorkOrder.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate(['machine', 'assignedTo', 'createdBy']);

  if (!workOrder) {
    throw new Error('Work order not found');
  }

  // When completed, record in the maintenance history
  if (status === 'Completed') {
    await History.create({
      machine: workOrder.machine._id || workOrder.machine,
      technician: workOrder.assignedTo,
      workOrder: workOrder._id,
      completionDate: workOrder.completedAt,
      remarks: 'Work order completed',
    });
  }

  logActivity(userId, `Work order ${workOrder.title} status updated to ${status}`);
  return workOrder;
};

// Fetch work orders with optional filters (priority, status, assignedTo)
const getWorkOrders = async (query = {}) => {
  const filter = {};
  if (query.priority) {
    filter.priority = query.priority;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }
  return WorkOrder.find(filter).populate(['machine', 'assignedTo', 'createdBy']);
};

// Get a single work order by its ID with related data populated
const getWorkOrderById = async (id) => {
  const workOrder = await WorkOrder.findById(id).populate([
    'machine',
    'assignedTo',
    'createdBy',
  ]);
  if (!workOrder) {
    throw new Error('Work order not found');
  }
  return workOrder;
};

// Delete a work order by ID and log the action
const deleteWorkOrder = async (id, userId) => {
  const workOrder = await WorkOrder.findByIdAndDelete(id);
  if (!workOrder) {
    throw new Error('Work order not found');
  }
  logActivity(userId, `Work order deleted: ${workOrder.title}`);
  return workOrder;
};

module.exports = {
  createWorkOrder,
  assignTechnician,
  updateStatus,
  getWorkOrders,
  getWorkOrderById,
  deleteWorkOrder,
};
