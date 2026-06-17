const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
      required: [true, 'Machine is required'],
    },
    maintenanceType: {
      type: String,
      required: [true, 'Maintenance type is required'],
      trim: true,
    },
    frequencyDays: {
      type: Number,
      required: [true, 'Frequency in days is required'],
      min: [1, 'Frequency must be at least 1 day'],
    },
    nextMaintenanceDate: {
      type: Date,
      required: [true, 'Next maintenance date is required'],
    },
    lastMaintenanceDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);
