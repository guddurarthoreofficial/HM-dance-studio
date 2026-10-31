
const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourses,
  updateCourse,
  deactivateCourse
} = require("../controllers/courseController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Create course
router.post(
  "/",
  protect,
  authorize("admin"),
  createCourse
);

// Get all courses
router.get(
  "/",
  protect,
  authorize("admin"),
  getCourses
);

// Update course
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateCourse
);

// Deactivate course
router.patch(
  "/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateCourse
);

module.exports = router;
