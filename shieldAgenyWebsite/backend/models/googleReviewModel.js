const mongoose = require('mongoose');

const GoogleReviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: [true, 'Reviewer name is required']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Rating is required']
    },
    reviewText: {
        type: String,
        required: [true, 'Review text is required']
    },
    reviewUrl: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        trim: true
    },
    publishedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GoogleReview', GoogleReviewSchema);

