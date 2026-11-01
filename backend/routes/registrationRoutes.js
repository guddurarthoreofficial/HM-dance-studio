
const express = require("express");
const router = express.Router();

const {
  createRegistration,
  getRegistrations,
} = require("../controllers/registrationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Public registration
router.post("/", createRegistration);

// Only authenticated admins can view registrations
router.get("/", protect, authorize("admin"), getRegistrations);

module.exports = router;
