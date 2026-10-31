
const Student = require("../models/Student");
const Course = require("../models/Course");
const StudentPackage = require("../models/StudentPackage");

// Admin: Assign package to student
const assignPackage = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Course ID are required",
      });
    }

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Active course package not found",
      });
    }

    const existingPending = await StudentPackage.findOne({
      student: student._id,
      status: "pending",
    });

    if (existingPending) {
      return res.status(409).json({
        success: false,
        message: "Student already has a pending package",
      });
    }

    const studentPackage = await StudentPackage.create({
      student: student._id,
      course: course._id,
      packageName: course.packageName,
      danceStyle: course.danceStyle,
      durationMonths: course.durationMonths,
      totalFees: course.totalFees,
      paymentStatus: "unpaid",
      status: "pending",
      assignedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Course package assigned. Payment is pending.",
      package: studentPackage,
    });
  } catch (error) {
    console.error("Assign Package Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to assign course package",
    });
  }
};

// Admin: Get packages of a particular student
const getStudentPackages = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const packages = await StudentPackage.find({
      student: student._id,
    })
      .populate("course", "packageName danceStyle durationMonths totalFees")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    console.error("Student Package History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch student packages",
    });
  }
};

// Student: Get only their own packages
const getMyPackages = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const packages = await StudentPackage.find({
      student: student._id,
    })
      .populate("course", "packageName danceStyle durationMonths totalFees")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    console.error("My Packages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your packages",
    });
  }
};

module.exports = {
  assignPackage,
  getStudentPackages,
  getMyPackages,
};
