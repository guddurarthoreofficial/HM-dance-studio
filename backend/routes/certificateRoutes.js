const express = require("express");
const router = express.Router();

const {
  createCertificate,
  getAllCertificates,
  getMyCertificates,
  downloadCertificate,
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

module.exports = router;
