const Application = require('../models/applicationModel');
const fs = require('fs');
const path = require('path');

// --- PUBLIC ---
// @desc    Create new application
// @route   POST /api/apply
// @access  Public
exports.createApplication = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Resume file is required.' });
        }
        const applicationData = { ...req.body, resume: req.file.path };
        const application = await Application.create(applicationData);
        res.status(201).json({ success: true, data: application });
    } catch (err) {
        // If there's an error, delete the uploaded file
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if(unlinkErr) console.error("Error deleting file after failed submission:", unlinkErr);
            });
        }
        next(err);
    }
};

// --- ADMIN ---
// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private
exports.getApplications = async (req, res, next) => {
    try {
        const applications = await Application.find().sort({ submittedAt: -1 });
        res.status(200).json({ success: true, data: applications });
    } catch (err) {
        next(err);
    }
};

// @desc    Update an application
// @route   PUT /api/admin/applications/:id
// @access  Private
exports.updateApplication = async (req, res, next) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.status(200).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete an application
// @route   DELETE /api/admin/applications/:id
// @access  Private
exports.deleteApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Delete the associated resume file
        fs.unlink(application.resume, (err) => {
            if (err) {
                console.error(`Could not delete file: ${application.resume}`, err);
                // Decide if you want to stop the process or just log the error
            }
        });
        
        await application.deleteOne();
        
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};