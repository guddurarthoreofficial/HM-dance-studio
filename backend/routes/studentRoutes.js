const express = require("express");
const router = express.Router();

const {
  createStudent,
  getMyProfile,
  getAllStudents,
  searchStudents,
  updateStudent,
  updateStudentStatus,
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/admission", protect, authorize("admin"), createStudent);
// Student can view only their own profile
router.get("/me", protect, authorize("student"), getMyProfile);

// Admin: All students
router.get("/", protect, authorize("admin"), getAllStudents);

// Admin: Search students
router.get("/search", protect, authorize("admin"), searchStudents);

router.put("/:studentId", protect, authorize("admin"), updateStudent);
router.patch(
  "/:studentId/status",
  protect,
  authorize("admin"),
  updateStudentStatus,
);

module.exports = router;
