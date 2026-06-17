const Machine = require('../models/Machine');
const logActivity = require('../utils/logger');

const createMachine = async (data, userId) => {
  const machine = await Machine.create(data);
  logActivity(userId, `Admin created machine ${machine.machineId}`);
  return machine;
};

const updateMachine = async (id, data, userId) => {
  const machine = await Machine.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!machine) {
    throw new Error('Machine not found');
  }
  logActivity(userId, `Admin updated machine ${machine.machineId}`);
  return machine;
};

const deleteMachine = async (id, userId) => {
  const machine = await Machine.findByIdAndDelete(id);
  if (!machine) {
    throw new Error('Machine not found');
  }
  logActivity(userId, `Admin deleted machine ${machine.machineId}`);
  return machine;
};

const getMachines = async (query = {}) => {
  const filter = {};
  if (query.machineId) {
    filter.machineId = { $regex: query.machineId, $options: 'i' };
  }
  if (query.department) {
    filter.department = query.department;
  }
  if (query.status) {
    filter.status = query.status;
  }
  return Machine.find(filter);
};

const getMachineById = async (id) => {
  const machine = await Machine.findById(id);
  if (!machine) {
    throw new Error('Machine not found');
  }
  return machine;
};

module.exports = {
  createMachine,
  updateMachine,
  deleteMachine,
  getMachines,
  getMachineById,
};
