
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
      trim: true
    },

    danceStyle: {
      type: String,
      required: true,
      trim: true
    },

    durationMonths: {
      type: Number,
      required: true,
      enum: [1, 3, 6]
    },

    totalFees: {
      type: Number,
      required: true,
      min: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
