// Records completed maintenance work — a permanent log of what was done
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine', // Which machine was serviced
      required: [true, 'Machine is required'],
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Which technician did the work
      required: [true, 'Technician is required'],
    },
    workOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkOrder', // Which work order this history entry belongs to
      required: [true, 'Work order is required'],
    },
    completionDate: {
      type: Date,
      default: Date.now, // Automatically set to the current date/time
    },
    remarks: {
      type: String,
      trim: true, // Any notes about the completed work
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);
