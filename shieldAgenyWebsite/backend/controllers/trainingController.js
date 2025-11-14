const Training = require('../models/trainingModel');

// @desc    Get all trainings
// @route   GET /api/admin/trainings
// @access  Private
exports.getTrainings = async (req, res, next) => {
  try {
    const trainings = await Training.find().sort({ date: -1 });
    res.status(200).json({ success: true, count: trainings.length, data: trainings });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new training
// @route   POST /api/admin/trainings
// @access  Private
exports.createTraining = async (req, res, next) => {
  try {
    const training = await Training.create(req.body);
    res.status(201).json({ success: true, data: training });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a training
// @route   PUT /api/admin/trainings/:id
// @access  Private
exports.updateTraining = async (req, res, next) => {
  try {
    const training = await Training.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }
    res.status(200).json({ success: true, data: training });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a training
// @route   DELETE /api/admin/trainings/:id
// @access  Private
exports.deleteTraining = async (req, res, next) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

