const Certificate = require("../models/Certificate");
const Student = require("../models/Student");
const StudentPackage = require("../models/StudentPackage");
const Counter = require("../models/Counter");

const generateCertificate = require("../utils/generateCertificate");
const sendCertificateEmail = require("../utils/sendCertificateEmail");

const createCertificate = async (req, res) => {
  try {
    const { studentId, packageId, completionDate } = req.body;

    if (!studentId || !packageId || !completionDate) {
      return res.status(400).json({
        success: false,
        message: "Student ID, package ID and completion date are required",
      });
    }

    const parsedDate = new Date(completionDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid completion date",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const studentPackage = await StudentPackage.findOne({
      _id: packageId,
      student: student._id,
    });

    if (!studentPackage) {
      return res.status(404).json({
        success: false,
        message: "Student package not found",
      });
    }

    const year = new Date().getFullYear();

    const counter = await Counter.findOneAndUpdate(
      { name: `certificate-${year}` },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true },
    );

    const certificateNumber = `HMDS-CERT-${year}-${String(counter.sequence).padStart(5, "0")}`;

    const certificate = await Certificate.create({
      student: student._id,
      studentPackage: studentPackage._id,
      studentName: student.name,
      courseName: studentPackage.packageName,
      durationMonths: studentPackage.durationMonths,
      completionDate: parsedDate,
      certificateNumber,
      generatedBy: req.user._id,
    });

    let emailSent = false;
    let emailError = null;

    try {
      const pdfBuffer = await generateCertificate({
        studentName: student.name,
        courseName: studentPackage.packageName,
        durationMonths: studentPackage.durationMonths,
        completionDate: parsedDate,
        certificateNumber,
      });

      await sendCertificateEmail({
        email: student.email,
        studentName: student.name,
        courseName: studentPackage.packageName,
        certificateNumber,
        pdfBuffer,
      });

      emailSent = true;
    } catch (mailError) {
      console.error("Certificate Email Error:", mailError.message);
      emailError = "Certificate created, but email could not be sent.";
    }

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      certificate,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error("Create Certificate Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate certificate",
    });
  }
};


const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name studentId email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    console.error("Get Certificates Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch certificates",
    });
  }
};


const getMyCertificates = async (req, res) => {
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

    const certificates = await Certificate.find({
      student: student._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    console.error("My Certificates Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your certificates",
    });
  }
};


const downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (req.user.role === "student") {
      const student = await Student.findOne({
        user: req.user._id,
      });

      if (
        !student ||
        certificate.student.toString() !== student._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You cannot download this certificate",
        });
      }
    }

    const pdfBuffer = await generateCertificate({
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      durationMonths: certificate.durationMonths,
      completionDate: certificate.completionDate,
      certificateNumber: certificate.certificateNumber,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${certificate.certificateNumber}.pdf"`
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Download Certificate Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to download certificate",
    });
  }
};


module.exports = {
  createCertificate,
  getAllCertificates,
  getMyCertificates,
  downloadCertificate,
};
