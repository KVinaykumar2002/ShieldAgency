const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    message: {
        type: String
    },
    resume: {
        type: String, // This will store the path to the uploaded file
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Interviewed', 'Selected', 'Rejected'],
        default: 'Pending'
    },
    notes: {
        type: String,
        trim: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);