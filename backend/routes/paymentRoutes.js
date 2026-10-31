
const express = require("express");
const router = express.Router();

const {
  recordPayment,
  getPaymentHistory,
  getStudentPayments,
  downloadReceipt,
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Record payment
router.post(
  "/record",
  protect,
  authorize("admin"),
  recordPayment
);

// General payment history
router.get(
  "/history",
  protect,
  authorize("admin", "student"),
  getPaymentHistory
);

// Student-specific payment history
router.get(
  "/student/:studentId",
  protect,
  authorize("admin"),
  getStudentPayments
);

// Download receipt
router.get(
  "/:paymentId/receipt",
  protect,
  authorize("admin", "student"),
  downloadReceipt
);

module.exports = router;
