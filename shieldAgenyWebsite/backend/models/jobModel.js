const mongoose = require('mongoose');

const JobOpeningSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    type: {
        type: String,
        required: [true, 'Please add a job type'],
        enum: ['Full-time', 'Part-time', 'Contract']
    },
    description: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('JobOpening', JobOpeningSchema);