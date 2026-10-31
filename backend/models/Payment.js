
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    studentPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentPackage",
      required: true,
      unique: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "bank_transfer"],
      required: true
    },

    paymentDate: {
      type: Date,
      default: Date.now
    },

    receiptNumber: {
      type: String,
      unique: true,
      required: true
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
