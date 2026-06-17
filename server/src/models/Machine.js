// Defines the schema for machines in the factory
const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: [true, 'Machine ID is required'], // Short identifier like "CNC-001"
      unique: true,
      uppercase: true, // Always stored in uppercase for consistency
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Machine name is required'], // Full display name of the machine
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'], // Which department this machine belongs to
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'], // Who built this machine
      trim: true,
    },
    installationDate: {
      type: Date,
      required: [true, 'Installation date is required'], // When the machine was installed
    },
    status: {
      type: String,
      enum: ['Running', 'Maintenance', 'Breakdown', 'Offline'], // Current operational status
      default: 'Running',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Machine', machineSchema);
