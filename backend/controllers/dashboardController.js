
const Student = require("../models/Student");
const StudentPackage = require("../models/StudentPackage");
const Payment = require("../models/Payment");
const Certificate = require("../models/Certificate");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      activePackages,
      totalPackages,
      totalCertificates,
      paymentStats,
      recentPayments,
      recentStudents,
    ] = await Promise.all([
      Student.countDocuments(),

      Student.countDocuments({
        // Active user accounts are checked separately below
      }),

      StudentPackage.countDocuments({
        status: "active",
        expiryDate: { $gte: new Date() },
      }),

      StudentPackage.countDocuments(),

      Certificate.countDocuments(),

      Payment.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            totalPayments: { $sum: 1 },
          },
        },
      ]),

      Payment.find()
        .populate("student", "name studentId")
        .sort({ paymentDate: -1 })
        .limit(5),

      Student.find()
        .select("-aadhaarNumber")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Count students whose linked user account is active
    const activeStudentCount = await Student.countDocuments({
      user: {
        $in: await require("../models/User")
          .find({ role: "student", isActive: true })
          .distinct("_id"),
      },
    });

    const revenue = paymentStats[0] || {
      totalRevenue: 0,
      totalPayments: 0,
    };

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents: activeStudentCount,
        activePackages,
        totalPackages,
        totalCertificates,
        totalRevenue: revenue.totalRevenue,
        totalPayments: revenue.totalPayments,
      },
      recentPayments,
      recentStudents,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics",
    });
  }
};

module.exports = { getDashboardStats };
