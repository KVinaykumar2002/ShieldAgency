const GoogleReview = require('../models/googleReviewModel');

// Public/Admin: Get all reviews
exports.getGoogleReviews = async (req, res, next) => {
    try {
        const reviews = await GoogleReview.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        next(err);
    }
};

// Admin: Create review
exports.createGoogleReview = async (req, res, next) => {
    try {
        const review = await GoogleReview.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

// Admin: Update review
exports.updateGoogleReview = async (req, res, next) => {
    try {
        const review = await GoogleReview.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

// Admin: Delete review
exports.deleteGoogleReview = async (req, res, next) => {
    try {
        const review = await GoogleReview.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

