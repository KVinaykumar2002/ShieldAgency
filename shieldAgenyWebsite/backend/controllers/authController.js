const Admin = require('../models/adminModel');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  sendTokenResponse(admin, 200, res);
};

// @desc    Update admin password
// @route   PUT /api/auth/change-password
// @access  Private (admin)
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new password are required' });
  }

  const admin = await Admin.findById(req.admin.id).select('+password');

  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found' });
  }

  const isMatch = await admin.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
};

// @desc    Upload admin avatar
// @route   POST /api/auth/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Avatar file is required' });
    }

    // Delete old avatar if exists
    if (admin.avatar) {
      const fs = require('fs');
      const path = require('path');
      const oldAvatarPath = path.join(__dirname, '..', admin.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    admin.avatar = `/uploads/avatars/${req.file.filename}`;
    await admin.save();

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

// Send admin response
const sendTokenResponse = (admin, statusCode, res) => {
  res.status(statusCode).json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'admin',
      avatar: admin.avatar || null
    }
  });
};