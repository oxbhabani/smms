const WorkOrder = require('../models/WorkOrder');
const History = require('../models/History');
const logActivity = require('../utils/logger');

const createWorkOrder = async (data, userId) => {
  const workOrder = await WorkOrder.create({ ...data, createdBy: userId });
  await workOrder.populate(['machine', 'assignedTo', 'createdBy']);
  logActivity(userId, `Work order created: ${workOrder.title}`);
  return workOrder;
};

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
