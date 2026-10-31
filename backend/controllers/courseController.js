
const Course = require("../models/Course");

// Create Course Package
const createCourse = async (req, res) => {
  try {
    const {
      packageName,
      danceStyle,
      durationMonths,
      totalFees
    } = req.body;

    if (
      !packageName ||
      !danceStyle ||
      ![1, 3, 6].includes(Number(durationMonths)) ||
      totalFees === undefined ||
      !Number.isFinite(Number(totalFees)) ||
      Number(totalFees) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course details"
      });
    }

    const course = await Course.create({
      packageName: packageName.trim(),
      danceStyle: danceStyle.trim(),
      durationMonths: Number(durationMonths),
      totalFees: Number(totalFees)
    });

    return res.status(201).json({
      success: true,
      message: "Course package created successfully",
      course
    });

  } catch (error) {
    console.error("Create Course Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create course package"
    });
  }
};

// Get All Course Packages
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses"
    });
  }
};

// Update Course Package
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "packageName",
      "danceStyle",
      "durationMonths",
      "totalFees"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.durationMonths !== undefined &&
      ![1, 3, 6].includes(Number(updates.durationMonths))
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration must be 1, 3 or 6 months"
      });
    }

    if (
      updates.totalFees !== undefined &&
      (!Number.isFinite(Number(updates.totalFees)) ||
        Number(updates.totalFees) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course fees"
      });
    }

    if (updates.durationMonths !== undefined) {
      updates.durationMonths = Number(updates.durationMonths);
    }

    if (updates.totalFees !== undefined) {
      updates.totalFees = Number(updates.totalFees);
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course package not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course package updated successfully",
      course
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update course package"
    });
  }
};

// Deactivate Course Package
const deactivateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course package not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course package deactivated successfully",
      course
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to deactivate course package"
    });
  }
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deactivateCourse
};
