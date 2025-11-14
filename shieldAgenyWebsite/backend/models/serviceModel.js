const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    icon: {
        type: String,
        required: [true, 'Please add an icon name'],
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        enum: ['Security', 'Housekeeping']
    }
});

module.exports = mongoose.model('Service', ServiceSchema);