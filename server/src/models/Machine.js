const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: [true, 'Machine ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Machine name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    installationDate: {
      type: Date,
      required: [true, 'Installation date is required'],
    },
    status: {
      type: String,
      enum: ['Running', 'Maintenance', 'Breakdown', 'Offline'],
      default: 'Running',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Machine', machineSchema);
