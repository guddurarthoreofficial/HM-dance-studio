const express = require("express");
const router = express.Router();

const {
  createCertificate,
  getAllCertificates,
  getMyCertificates,
  downloadCertificate,
  getStudentCertificates,
} = require("../controllers/certificateController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/generate", protect, authorize("admin"), createCertificate);

router.get("/", protect, authorize("admin"), getAllCertificates);

router.get("/my", protect, authorize("student"), getMyCertificates);

router.get(
  "/:id/download",
  protect,
  authorize("admin", "student"),
  downloadCertificate,
);

router.get(
  "/student/:studentId",
  protect,
  authorize("admin"),
  getStudentCertificates
);

module.exports = router;
