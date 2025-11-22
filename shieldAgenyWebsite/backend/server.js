// ==================== IMPORTS ====================
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// ==================== CONNECT TO MONGODB ====================
connectDB();

// ==================== INITIALIZE APP ====================
const app = express();

// ==================== MIDDLEWARE ====================

// Increase payload size for JSON + Form Data
app.use(
  express.json({
    limit: '100mb'
  })
);

app.use(
  express.urlencoded({
    limit: '100mb',
    extended: true,
    parameterLimit: 100000
  })
);

// CORS Configuration — Allow all origins
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Pre-Flight Handling
app.options("*", cors());

// File Upload Configuration
app.use(
  fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    useTempFiles: true,
    tempFileDir: "/tmp/",
    abortOnLimit: true
  })
);

// Static Uploads Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== ROUTES ====================
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Correct route mounting
app.use('/api/auth', authRoutes);    // Login/Register
app.use('/api/users', userRoutes);   // User routes
app.use('/api', publicRoutes);       // Public API
app.use('/api/admin', adminRoutes);  // Admin panel

// ==================== HEALTH CHECK (VERY IMPORTANT ON RENDER) ====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully!"
  });
});

// ==================== ERROR HANDLER ====================
app.use(errorHandler);

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ==================== UNHANDLED PROMISE REJECTIONS ====================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
