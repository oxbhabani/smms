// dashboardService.js — Aggregate statistics for the dashboard overview

const Machine = require('../models/Machine');
const WorkOrder = require('../models/WorkOrder');
const Schedule = require('../models/Schedule');

// Fetch counts for machines, work orders, and upcoming maintenance in parallel
const getStats = async () => {
  const [
    totalMachines,
    maintenanceMachines,
    breakdownMachines,
    openWorkOrders,
    inProgressWorkOrders,
    completedWorkOrders,
    upcomingMaintenance,
  ] = await Promise.all([
    Machine.countDocuments(),
    Machine.countDocuments({ status: 'Maintenance' }),
    Machine.countDocuments({ status: 'Breakdown' }),
    WorkOrder.countDocuments({ status: 'Open' }),
    WorkOrder.countDocuments({ status: 'In Progress' }),
    WorkOrder.countDocuments({ status: 'Completed' }),
    // Count schedules with a future or today maintenance date
    Schedule.countDocuments({ nextMaintenanceDate: { $gte: new Date() } }),
  ]);

  return {
    totalMachines,
    underMaintenance: maintenanceMachines,
    breakdown: breakdownMachines,
    openWorkOrders,
    inProgress: inProgressWorkOrders,
    completed: completedWorkOrders,
    upcomingMaintenance,
  };
};

module.exports = { getStats };
