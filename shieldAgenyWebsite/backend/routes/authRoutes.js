const express = require('express');
const { login, getMe, updatePassword, uploadAvatar } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');
const avatarUpload = require('../middleware/avatarUploadMiddleware');

const router = express.Router();

// Admin login only (no registration via API for security)
router.post('/login', login);
router.get('/me', protectAdmin, getMe);
router.put('/change-password', protectAdmin, updatePassword);
router.post('/avatar', avatarUpload, uploadAvatar);

module.exports = router;