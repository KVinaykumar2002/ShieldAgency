const GalleryItem = require('../models/galleryItemModel');

// --- PUBLIC CONTROLLERS ---

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getGalleryItems = async (req, res, next) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// --- ADMIN CONTROLLERS ---

// @desc    Create a gallery item
// @route   POST /api/admin/gallery
// @access  Private
exports.createGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a gallery item
// @route   PUT /api/admin/gallery/:id
// @access  Private
exports.updateGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/admin/gallery/:id
// @access  Private
exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

