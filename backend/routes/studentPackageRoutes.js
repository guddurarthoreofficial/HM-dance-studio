
const express = require("express");
const router = express.Router();

const {
  assignPackage
} = require("../controllers/studentPackageController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

router.post(
  "/assign",
  protect,
  authorize("admin"),
  assignPackage
);

module.exports = router;
