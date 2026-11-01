const Registration = require("../models/Registration");
const User = require("../models/User");
const sendRegistrationEmail = require("../utils/sendRegistrationEmail");

const createRegistration = async (req, res) => {
  try {
    const {
      studentName,
      fatherName,
      motherName,
      dateOfBirth,
      aadhaarNumber,
      studentMobile,
      parentMobile,
      email,
      currentAddress,
      permanentAddress,
      gender,
    } = req.body;

    const requiredFields = {
      studentName,
      fatherName,
      motherName,
      dateOfBirth,
      studentMobile,
      parentMobile,
      email,
      currentAddress,
      permanentAddress,
      gender,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const dob = new Date(dateOfBirth);

    if (Number.isNaN(dob.getTime()) || dob >= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid date of birth",
      });
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender",
      });
    }

    if (
      !/^\d{10}$/.test(studentMobile.trim()) ||
      !/^\d{10}$/.test(parentMobile.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Mobile numbers must contain exactly 10 digits",
      });
    }

    let aadhaar = null;

    if (aadhaarNumber && String(aadhaarNumber).trim()) {
      aadhaar = String(aadhaarNumber).trim();

      if (!/^\d{12}$/.test(aadhaar)) {
        return res.status(400).json({
          success: false,
          message: "Aadhaar number must contain exactly 12 digits",
        });
      }
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this email",
      });
    }

    const existingRegistration = await Registration.findOne({
      email: normalizedEmail,
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "This email has already been used for registration",
      });
    }

    const registration = await Registration.create({
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      dateOfBirth: dob,
      aadhaarNumber: aadhaar,
      studentMobile: studentMobile.trim(),
      parentMobile: parentMobile.trim(),
      email: normalizedEmail,
      currentAddress: currentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      gender,
    });

    let emailSent = true;

    try {
      await sendRegistrationEmail(registration);
    } catch (emailError) {
      emailSent = false;
      console.error("Registration email error:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Registration submitted successfully. Confirmation email sent."
        : "Registration saved, but email delivery failed.",
      registrationId: registration._id,
      status: registration.status,
      emailSent,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit registration",
    });
  }
};

const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .select("-password -aadhaarNumber")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("Get registrations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch registrations",
    });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
};
