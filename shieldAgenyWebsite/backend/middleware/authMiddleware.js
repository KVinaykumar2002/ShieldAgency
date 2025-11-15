// Middleware functions - JWT checking removed, all routes are now accessible
// Protect routes - handles both user and admin (no longer verifies JWT)
exports.protect = async (req, res, next) => {
  // JWT verification removed - allow all requests
  next();
};

// Protect admin routes only (no longer verifies JWT)
exports.protectAdmin = async (req, res, next) => {
  // JWT verification removed - allow all requests
  next();
};