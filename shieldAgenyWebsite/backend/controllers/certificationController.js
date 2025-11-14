const Certification = require('../models/certificationModel');

// --- PUBLIC CONTROLLERS ---

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
exports.getCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: certifications });
  } catch (err) {
    next(err);
  }
};

// --- ADMIN CONTROLLERS ---

// @desc    Create a certification
// @route   POST /api/admin/certifications
// @access  Private
exports.createCertification = async (req, res, next) => {
  try {
    const certification = await Certification.create(req.body);
    res.status(201).json({ success: true, data: certification });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a certification
// @route   PUT /api/admin/certifications/:id
// @access  Private
exports.updateCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!certification) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }
    res.status(200).json({ success: true, data: certification });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a certification
// @route   DELETE /api/admin/certifications/:id
// @access  Private
exports.deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

