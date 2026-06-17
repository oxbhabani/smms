// Tracks what users do in the system (e.g. "created work order", "logged in")
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Which user performed the action
      required: [true, 'User is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'], // Description of what they did
      trim: true,
    },
  },
  { timestamps: true } // createdAt tells us when the action happened
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
