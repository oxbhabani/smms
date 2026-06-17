// Handles machine CRUD operations

const machineValidator = require('../validators/machineValidator');
const machineService = require('../services/machineService');
const WorkOrder = require('../models/WorkOrder');

// @desc   Create a new machine
// @route  POST /api/machines
// @access Private/Admin
const createMachine = async (req, res) => {
  try {
    const { errors } = machineValidator.validateCreateMachine(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }
    const machine = await machineService.createMachine(req.body, req.user.id);
    res.status(200).json({ success: true, data: machine });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// @desc   Update an existing machine
// @route  PUT /api/machines/:id
// @access Private/Admin
const updateMachine = async (req, res) => {
  try {
    const { errors } = machineValidator.validateUpdateMachine(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0].message });
    }
    const machine = await machineService.updateMachine(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: machine });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// @desc   Delete a machine (only if no active work orders)
// @route  DELETE /api/machines/:id
// @access Private/Admin
const deleteMachine = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find({ machine: req.params.id });
    if (workOrders.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete machine with active work orders' });
    }
    const machine = await machineService.deleteMachine(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: machine });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// @desc   Get all machines (with optional filters)
// @route  GET /api/machines
// @access Private
const getMachines = async (req, res) => {
  try {
    const machines = await machineService.getMachines(req.query);
    res.status(200).json({ success: true, data: machines });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// @desc   Get a single machine by ID
// @route  GET /api/machines/:id
// @access Private
const getMachine = async (req, res) => {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    res.status(200).json({ success: true, data: machine });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { createMachine, updateMachine, deleteMachine, getMachines, getMachine };
