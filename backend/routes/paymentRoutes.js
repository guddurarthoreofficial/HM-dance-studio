const express = require("express");
const router = express.Router();

const {
  recordPayment,
  getPaymentHistory,
  downloadReceipt,
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/record", protect, authorize("admin"), recordPayment);

router.get(
  "/history",
  protect,
  authorize("admin", "student"),
  getPaymentHistory,
);

router.get(
  "/:paymentId/receipt",
  protect,
  authorize("admin", "student"),
  downloadReceipt,
);

module.exports = router;
