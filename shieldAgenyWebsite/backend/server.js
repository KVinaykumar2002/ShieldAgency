// Import dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload'); // for handling large file uploads
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

/* -------------------- 🔧 Middleware Configuration -------------------- */

// Increase payload size limit for JSON and form data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100000 }));

// Enable CORS for all routes
app.use(cors());

// Enable file uploads up to 100MB
app.use(
  fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* -------------------- 🚏 API Routes -------------------- */

app.use('/api/auth', authRoutes); // Admin auth routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api', publicRoutes); // Public routes
app.use('/api/admin', adminRoutes); // Admin panel routes

/* -------------------- ⚙️ Error Handling -------------------- */

// Custom error handler middleware
app.use(errorHandler);

/* -------------------- 🚀 Server Initialization -------------------- */

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* -------------------- 💥 Unhandled Promise Rejection Handler -------------------- */

process.on('unhandledRejection', (err) => {
  console.error(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});
