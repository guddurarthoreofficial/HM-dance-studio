
const mongoose = require("mongoose");

const studentPackageSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    packageName: {
      type: String,
      required: true
    },

    danceStyle: {
      type: String,
      required: true
    },

    durationMonths: {
      type: Number,
      enum: [1, 3, 6],
      required: true
    },

    totalFees: {
      type: Number,
      required: true,
      min: 0
    },

    startDate: {
      type: Date,
      default: null
    },

    expiryDate: {
      type: Date,
      default: null
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid"
    },

    status: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending"
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "StudentPackage",
  studentPackageSchema
);
