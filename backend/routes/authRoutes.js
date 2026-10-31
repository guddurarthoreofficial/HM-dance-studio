
const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Login
router.post("/login", login);

// Get logged-in user
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      studentId: req.user.studentId || null,
      role: req.user.role
    }
  });
});

module.exports = router;
