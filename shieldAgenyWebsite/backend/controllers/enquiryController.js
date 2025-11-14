const Enquiry = require('../models/enquiryModel');

// --- PUBLIC ---
// @desc    Create new enquiry
// @route   POST /api/contact
// @access  Public
exports.createEnquiry = async (req, res, next) => {
    try {
        const enquiry = await Enquiry.create(req.body);
        res.status(201).json({ success: true, data: enquiry });
    } catch (err) {
        next(err);
    }
};

// --- ADMIN ---
// @desc    Get all enquiries
// @route   GET /api/admin/enquiries
// @access  Private
exports.getEnquiries = async (req, res, next) => {
    try {
        const enquiries = await Enquiry.find().sort({ submittedAt: -1 });
        res.status(200).json({ success: true, data: enquiries });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete an enquiry
// @route   DELETE /api/admin/enquiries/:id
// @access  Private
exports.deleteEnquiry = async (req, res, next) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: 'Enquiry not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};