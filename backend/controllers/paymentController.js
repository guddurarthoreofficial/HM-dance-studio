const Payment = require("../models/Payment");
const StudentPackage = require("../models/StudentPackage");
const Counter = require("../models/Counter");

const Student = require("../models/Student");
const generateReceipt = require("../utils/generateReceipt");
const sendPaymentEmail = require("../utils/sendPaymentEmail");

// Add calendar months without overflowing month-end dates
const addMonths = (date, months) => {
  const result = new Date(date);
  const day = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();

  result.setDate(Math.min(day, lastDay));

  return result;
};

const recordPayment = async (req, res) => {
  try {
    const { packageId, paymentMode, amount } = req.body;

    if (!packageId || !paymentMode || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Package ID, amount and payment mode are required",
      });
    }

    if (!["cash", "upi", "bank_transfer"].includes(paymentMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment mode",
      });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const studentPackage = await StudentPackage.findById(packageId);

    if (!studentPackage) {
      return res.status(404).json({
        success: false,
        message: "Student package not found",
      });
    }

    if (studentPackage.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Package is not pending payment",
      });
    }

    if (Number(amount) !== studentPackage.totalFees) {
      return res.status(400).json({
        success: false,
        message: `Full package fee required: ${studentPackage.totalFees}`,
      });
    }

    const existingPayment = await Payment.findOne({
      studentPackage: studentPackage._id,
    });

    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: "Payment already recorded for this package",
      });
    }

    const now = new Date();

    // Find the latest package for this student
    const previousPackage = await StudentPackage.findOne({
      student: studentPackage.student,
      status: "active",
      expiryDate: { $gte: now },
    }).sort({ expiryDate: -1 });

    // Renewal starts after the previous package expires
    const startDate = previousPackage
      ? new Date(previousPackage.expiryDate)
      : now;

    if (previousPackage) {
      startDate.setDate(startDate.getDate() + 1);
    }

    const expiryDate = addMonths(startDate, studentPackage.durationMonths);

    const year = now.getFullYear();

    const counter = await Counter.findOneAndUpdate(
      { name: `receipt-${year}` },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true },
    );

    const receiptNumber = `HMDS-RCP-${year}-${String(counter.sequence).padStart(5, "0")}`;

    const payment = await Payment.create({
      student: studentPackage.student,
      studentPackage: studentPackage._id,
      amount: Number(amount),
      paymentMode,
      paymentDate: now,
      receiptNumber,
      recordedBy: req.user._id,
    });

    studentPackage.paymentStatus = "paid";
    studentPackage.status = "active";
    studentPackage.startDate = startDate;
    studentPackage.expiryDate = expiryDate;

    await studentPackage.save();

    // Generate PDF receipt and send confirmation email
    let emailSent = false;
    let emailError = null;

    try {
      const student = await Student.findById(studentPackage.student);

      if (!student) {
        throw new Error("Student record not found");
      }

      const pdfBuffer = await generateReceipt({
        receiptNumber,
        studentName: student.name,
        studentId: student.studentId,
        email: student.email,
        packageName: studentPackage.packageName,
        danceStyle: studentPackage.danceStyle,
        paymentDate: now,
        paymentMode,
        amount: Number(amount),
      });

      await sendPaymentEmail({
        email: student.email,
        studentName: student.name,
        receiptNumber,
        amount: Number(amount),
        pdfBuffer,
      });

      emailSent = true;
    } catch (mailError) {
      console.error("Receipt Email Error:", mailError.message);
      emailError = "Payment saved, but receipt email could not be sent.";
    }

    return res.status(201).json({
      success: true,
      message: "Payment recorded and package activated successfully",
      emailSent,
      emailError,
      payment,
      package: {
        packageName: studentPackage.packageName,
        startDate: studentPackage.startDate,
        expiryDate: studentPackage.expiryDate,
        status: studentPackage.status,
      },
    });
  } catch (error) {
    console.error("Record Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to record payment",
    });
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found",
        });
      }

      query.student = student._id;
    }

    const payments = await Payment.find(query)
      .populate("student", "name studentId email")
      .populate("studentPackage", "packageName danceStyle durationMonths")
      .sort({ paymentDate: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Payment History Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch payment history",
    });
  }
};

// Download payment receipt PDF
const downloadReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate("student", "name studentId email")
      .populate("studentPackage");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Student can download only their own receipt
    if (
      req.user.role === "student" &&
      payment.student.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to download this receipt",
      });
    }

    const student = payment.student;
    const studentPackage = payment.studentPackage;

    const pdfBuffer = await generateReceipt({
      receiptNumber: payment.receiptNumber,
      studentName: student.name,
      studentId: student.studentId,
      email: student.email,
      packageName: studentPackage.packageName,
      danceStyle: studentPackage.danceStyle,
      paymentDate: payment.paymentDate,
      paymentMode: payment.paymentMode,
      amount: payment.amount,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${payment.receiptNumber}.pdf"`,
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Receipt Download Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to download receipt",
    });
  }
};

const getStudentPayments = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const payments = await Payment.find({
      student: student._id,
    })
      .populate("student", "name studentId email")
      .populate(
        "studentPackage",
        "packageName danceStyle durationMonths totalFees startDate expiryDate",
      )
      .sort({ paymentDate: -1 });

    const totalPaid = payments.reduce(
      (total, payment) => total + payment.amount,
      0,
    );

    return res.status(200).json({
      success: true,
      count: payments.length,
      totalPaid,
      payments,
    });
  } catch (error) {
    console.error("Student Payment History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch student payment history",
    });
  }
};

module.exports = {
  recordPayment,
  getPaymentHistory,
  getStudentPayments,
  downloadReceipt,
};
