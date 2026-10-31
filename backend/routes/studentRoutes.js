const express = require("express");
const router = express.Router();

const {
  createStudent,
  getMyProfile,
  getAllStudents,
  searchStudents,
  getStudentById,
  updateStudent,
  updateStudentStatus,
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admission
router.post("/admission", protect, authorize("admin"), createStudent);

// Student profile
router.get("/me", protect, authorize("student"), getMyProfile);

// Admin: Student listing and search
router.get("/", protect, authorize("admin"), getAllStudents);
router.get("/search", protect, authorize("admin"), searchStudents);

// Admin: Individual student details
router.get("/:studentId", protect, authorize("admin"), getStudentById);

// Admin: Update and block/unblock
router.put("/:studentId", protect, authorize("admin"), updateStudent);

router.patch(
  "/:studentId/status",
  protect,
  authorize("admin"),
  updateStudentStatus
);

module.exports = router;