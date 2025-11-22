const express = require('express');
const { register, login, getMe, uploadAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const avatarUpload = require('../middleware/avatarUploadMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/avatar', avatarUpload, uploadAvatar);

module.exports = router;

