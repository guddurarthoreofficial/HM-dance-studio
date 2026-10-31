
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    studentPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentPackage",
      required: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    durationMonths: {
      type: Number,
      enum: [1, 3, 6],
      required: true,
    },

    completionDate: {
      type: Date,
      required: true,
    },

    certificateNumber: {
      type: String,
      unique: true,
      required: true,
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
