const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a certification title'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL for the certification'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: 'certifications',
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Certification', CertificationSchema);

