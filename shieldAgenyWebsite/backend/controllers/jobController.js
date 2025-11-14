const JobOpening = require('../models/jobModel');

// --- PUBLIC ---
// @desc    Get all job openings
// @route   GET /api/jobs
// @access  Public
exports.getJobOpenings = async (req, res, next) => {
    try {
        const jobs = await JobOpening.find();
        res.status(200).json({ success: true, data: jobs });
    } catch (err) {
        next(err);
    }
};

// --- ADMIN --- (Example - add routes in adminRoutes.js to use)
// @desc    Create a new job opening
// @route   POST /api/admin/jobs
// @access  Private
exports.createJobOpening = async (req, res, next) => {
    try {
        const job = await JobOpening.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        next(err);
    }
};