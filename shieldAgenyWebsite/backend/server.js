// Import dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload'); // for handling large file uploads
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB (non-blocking - server will start even if DB connection fails)
connectDB().catch(err => {
  console.error('Database connection failed, but server will continue:', err.message);
});

// Import route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const googleReviewRoutes = require('./routes/googleReviewRoutes');

// Initialize Express app
const app = express();

/* -------------------- 🔧 Middleware Configuration -------------------- */

// Increase payload size limit for JSON and form data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100000 }));

// Enable CORS for all routes - allow all origins
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

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

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/auth', authRoutes); // Admin auth routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api', publicRoutes); // Public routes
app.use('/api/admin', adminRoutes); // Admin panel routes
app.use('/api/google-reviews', googleReviewRoutes); // Google Reviews routes (public GET, admin POST/PUT/DELETE)

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

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
