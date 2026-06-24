const adminMiddleware = (req, res, next) => {
  try {
    // Check user exists
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export default adminMiddleware;
