const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create avatars directory if it doesn't exist
const avatarDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, avatarDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only! (jpeg, jpg, png, gif, webp)');
  }
}

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('avatar'); // 'avatar' is the field name in the form

module.exports = upload;

