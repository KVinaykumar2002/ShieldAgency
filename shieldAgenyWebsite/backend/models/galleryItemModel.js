const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a gallery title'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: 'general',
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

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);

