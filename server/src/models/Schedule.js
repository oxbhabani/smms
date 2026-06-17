// Defines the maintenance schedule for each machine
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine', // Links to the Machine collection
      required: [true, 'Machine is required'],
    },
    maintenanceType: {
      type: String,
      required: [true, 'Maintenance type is required'], // e.g. "Oil Change", "Inspection"
      trim: true,
    },
    frequencyDays: {
      type: Number,
      required: [true, 'Frequency in days is required'], // How often maintenance repeats
      min: [1, 'Frequency must be at least 1 day'],
    },
    nextMaintenanceDate: {
      type: Date,
      required: [true, 'Next maintenance date is required'], // When the next maintenance is due
    },
    lastMaintenanceDate: {
      type: Date, // When the last maintenance was done (optional until first service)
    },
    notes: {
      type: String,
      trim: true, // Any extra instructions or notes
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);
