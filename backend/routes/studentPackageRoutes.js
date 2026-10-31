
const express = require("express");
const router = express.Router();

const {
  assignPackage,
  getStudentPackages,
} = require("../controllers/studentPackageController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/assign",
  protect,
  authorize("admin"),
  assignPackage
);

router.get(
  "/student/:studentId",
  protect,
  authorize("admin"),
  getStudentPackages
);

module.exports = router;
