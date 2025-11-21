const GoogleReview = require('../models/googleReviewModel');
const mongoose = require('mongoose');

// Public/Admin: Get all reviews
exports.getGoogleReviews = async (req, res, next) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database connection unavailable. Please try again later.' 
            });
        }
        
        const reviews = await GoogleReview.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        console.error('Error fetching Google reviews:', err);
        next(err);
    }
};

// Admin: Create review
exports.createGoogleReview = async (req, res, next) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database connection unavailable. Please try again later.' 
            });
        }
        
        const review = await GoogleReview.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        console.error('Error creating Google review:', err);
        next(err);
    }
};

// Admin: Update review
exports.updateGoogleReview = async (req, res, next) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database connection unavailable. Please try again later.' 
            });
        }
        
        const review = await GoogleReview.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, data: review });
    } catch (err) {
        console.error('Error updating Google review:', err);
        next(err);
    }
};

// Admin: Delete review
exports.deleteGoogleReview = async (req, res, next) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database connection unavailable. Please try again later.' 
            });
        }
        
        const review = await GoogleReview.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Error deleting Google review:', err);
        next(err);
    }
};

