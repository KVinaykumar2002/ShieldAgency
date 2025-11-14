const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a training title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  instructor: {
    type: String,
    required: [true, 'Please add an instructor name'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a training date']
  },
  duration: {
    type: String,
    required: [true, 'Please add training duration'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guard'
  }],
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Training', TrainingSchema);

