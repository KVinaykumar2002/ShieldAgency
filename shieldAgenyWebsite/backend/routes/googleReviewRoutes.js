const express = require('express');
const {
  getGoogleReviews,
  createGoogleReview,
  updateGoogleReview,
  deleteGoogleReview,
} = require('../controllers/googleReviewController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route - Get all Google reviews
router.get('/', getGoogleReviews);

// Admin routes - require authentication
router.use(protectAdmin);
router.post('/', createGoogleReview);
router.put('/:id', updateGoogleReview);
router.delete('/:id', deleteGoogleReview);

module.exports = router;

