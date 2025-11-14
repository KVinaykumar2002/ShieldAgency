const express = require('express');
const { getServices } = require('../controllers/serviceController');
const { getTestimonials } = require('../controllers/testimonialController');
const { getJobOpenings } = require('../controllers/jobController');
const { createApplication } = require('../controllers/applicationController');
const { createEnquiry } = require('../controllers/enquiryController');
const upload = require('../middleware/uploadMiddleware');
const { getCertifications } = require('../controllers/certificationController');
const { getGalleryItems } = require('../controllers/galleryController');

const router = express.Router();

// Public GET routes
router.get('/services', getServices);
router.get('/testimonials', getTestimonials);
router.get('/jobs', getJobOpenings);
router.get('/certifications', getCertifications);
router.get('/gallery', getGalleryItems);

// Public POST routes for forms
router.post('/apply', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        createApplication(req, res, next);
    });
});
router.post('/contact', createEnquiry);

module.exports = router;