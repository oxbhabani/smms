// Defines a work order — a task to repair or inspect a machine
const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'], // Short summary of the task
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'], // Detailed explanation of the work needed
      trim: true,
    },
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine', // Links to the machine that needs work
      required: [true, 'Machine is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'], // How urgent the work is
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Completed', 'Cancelled'], // Current stage of the work order
      default: 'Open',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Which technician is responsible (optional until assigned)
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Who created this work order
      required: [true, 'Creator is required'],
    },
    completedAt: {
      type: Date, // When the work was finished (set when status becomes Completed)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkOrder', workOrderSchema);
