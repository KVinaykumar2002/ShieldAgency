const express = require('express');
const { login, getMe, updatePassword } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin login only (no registration via API for security)
router.post('/login', login);
router.get('/me', protectAdmin, getMe);
router.put('/change-password', protectAdmin, updatePassword);

module.exports = router;