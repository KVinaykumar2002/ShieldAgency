const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Enquiry', EnquirySchema);