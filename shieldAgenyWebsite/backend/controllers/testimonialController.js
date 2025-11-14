const Testimonial = require('../models/testimonialModel');

// --- PUBLIC ---
// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res, next) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json({ success: true, data: testimonials });
    } catch (err) {
        next(err);
    }
};


// --- ADMIN --- (Example - add routes in adminRoutes.js to use)
// @desc    Create a new testimonial
// @route   POST /api/admin/testimonials
// @access  Private
exports.createTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json({ success: true, data: testimonial });
    } catch (err) {
        next(err);
    }
};