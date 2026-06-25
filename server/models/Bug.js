const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bug', bugSchema);
