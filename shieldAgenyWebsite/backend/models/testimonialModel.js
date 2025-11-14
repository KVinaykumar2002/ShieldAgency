const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: [true, 'Please add a quote']
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    image: {
        type: String, // URL to image
        default: 'no-photo.jpg'
    }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);