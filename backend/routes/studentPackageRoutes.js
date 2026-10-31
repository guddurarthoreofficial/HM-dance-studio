
const express = require("express");
const router = express.Router();

const {
  assignPackage,
  getStudentPackages,
  getMyPackages,
} = require("../controllers/studentPackageController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Admin: Assign package
router.post(
  "/assign",
  protect,
  authorize("admin"),
  assignPackage
);

// Student: Get own packages
router.get(
  "/my",
  protect,
  authorize("student"),
  getMyPackages
);

// Admin: Get packages of a particular student
router.get(
  "/student/:studentId",
  protect,
  authorize("admin"),
  getStudentPackages
);

module.exports = router;
