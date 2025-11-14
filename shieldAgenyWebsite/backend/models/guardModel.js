const mongoose = require('mongoose');

const GuardSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please add a guard ID'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    shift: {
        type: String,
        required: [true, 'Please add a shift'],
        enum: ['Day', 'Night', 'Flex'],
    },
    contact: {
        type: String,
        required: [true, 'Please add a contact number'],
    },
    status: {
        type: String,
        required: [true, 'Please add a status'],
        enum: ['Active', 'On Leave'],
    },
    image: {
        type: String, // URL to the image
        default: 'no-photo.jpg'
    }
});

module.exports = mongoose.model('Guard', GuardSchema);