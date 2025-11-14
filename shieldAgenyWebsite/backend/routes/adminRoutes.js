const express = require('express');
const { protectAdmin } = require('../middleware/authMiddleware');

// Import controllers
const { createGuard, getGuards, updateGuard, deleteGuard } = require('../controllers/guardController');
const { createService, updateService, deleteService } = require('../controllers/serviceController');
const { getApplications, updateApplication, deleteApplication } = require('../controllers/applicationController');
const { getEnquiries, deleteEnquiry } = require('../controllers/enquiryController');
const {
  createCertification,
  deleteCertification,
  getCertifications,
  updateCertification,
} = require('../controllers/certificationController');
const {
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
  getGalleryItems,
} = require('../controllers/galleryController');
const { getDashboardStats } = require('../controllers/dashboardController');
const { createTraining, getTrainings, updateTraining, deleteTraining } = require('../controllers/trainingController');
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');
// Add other controllers as you create them

const router = express.Router();

// All routes in this file are protected (admin only)
router.use(protectAdmin);

// Dashboard Routes
router.route('/dashboard/stats').get(getDashboardStats);

// Guard Routes
router.route('/guards').get(getGuards).post(createGuard);
router.route('/guards/:id').put(updateGuard).delete(deleteGuard);

// Service Routes
router.route('/services').post(createService); // GET is public
router.route('/services/:id').put(updateService).delete(deleteService);

// Application Routes
router.route('/applications').get(getApplications);
router.route('/applications/:id').put(updateApplication).delete(deleteApplication);

// Enquiry Routes
router.route('/enquiries').get(getEnquiries);
router.route('/enquiries/:id').delete(deleteEnquiry);

// Certification Routes
router.route('/certifications').get(getCertifications).post(createCertification);
router.route('/certifications/:id').put(updateCertification).delete(deleteCertification);

// Gallery Routes
router.route('/gallery').get(getGalleryItems).post(createGalleryItem);
router.route('/gallery/:id').put(updateGalleryItem).delete(deleteGalleryItem);

// Training Routes
router.route('/trainings').get(getTrainings).post(createTraining);
router.route('/trainings/:id').put(updateTraining).delete(deleteTraining);

// Customer Routes
router.route('/customers').get(getCustomers).post(createCustomer);
router.route('/customers/:id').put(updateCustomer).delete(deleteCustomer);

// Add routes for Testimonials, Jobs, Management etc. here following the same pattern.
// Example:
// const { createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
// router.route('/testimonials').post(createTestimonial);
// router.route('/testimonials/:id').put(updateTestimonial).delete(deleteTestimonial);

module.exports = router;