const User = require("../models/User");
const Student = require("../models/Student");
const Counter = require("../models/Counter");

const transporter = require("../config/mailer");




const createStudent = async (req, res) => {
  let createdUser;
  let createdStudent;

  try {
    const {
      name,
      fatherName,
      motherName,
      dateOfBirth,
      gender,
      aadhaarNumber,
      phone,
      parentPhone,
      email,
      password,
      presentAddress,
      permanentAddress,
    } = req.body;

    // Required field validation
    if (
      !name ||
      !fatherName ||
      !motherName ||
      !dateOfBirth ||
      !gender ||
      !aadhaarNumber ||
      !phone ||
      !parentPhone ||
      !email ||
      !password ||
      !presentAddress ||
      !permanentAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "All student details are required",
      });
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar number",
      });
    }

    if (!/^\d{10}$/.test(phone) || !/^\d{10}$/.test(parentPhone)) {
      return res.status(400).json({
        success: false,
        message: "Mobile numbers must contain 10 digits",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Generate Student ID
    const year = new Date().getFullYear();

    const counter = await Counter.findOneAndUpdate(
      { name: `student-${year}` },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );

    const studentId = `HMDS-${year}-${String(
      counter.sequence
    ).padStart(4, "0")}`;

    // Create login account
    // User model should hash password using its existing bcrypt pre-save hook.
    createdUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      studentId,
      role: "student",
      isActive: true,
    });

    // Create student profile
    createdStudent = await Student.create({
      user: createdUser._id,
      studentId,
      name: name.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      dateOfBirth,
      gender,
      aadhaarNumber,
      phone,
      parentPhone,
      email: normalizedEmail,
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      admissionDate: new Date(),
    });

    // Send login credentials to student's email
    let emailSent = false;
    let emailError = null;

    try {
      await transporter.sendMail({
        from: `"HM Dance Studio" <${process.env.SMTP_USER}>`,
        to: normalizedEmail,
        subject: "Welcome to HM Dance Studio - Your Login Credentials",
        text: `
Hello ${name},

Welcome to HM Dance Studio!

Your admission has been successfully completed.

Your student login details are:

Student ID: ${studentId}
Login Email: ${normalizedEmail}
Temporary Password: ${password}

Please log in using these credentials and change your password after your first login.

Keep your login credentials confidential.

Regards,
HM Dance Studio
        `,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;border:1px solid #eee;border-radius:12px;color:#222">
            <h2 style="color:#6d28d9">Welcome to HM Dance Studio!</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your admission has been successfully completed.</p>
            <p>Here are your student login credentials:</p>

            <div style="background:#f5f3ff;padding:18px;border-radius:8px">
              <p><strong>Student ID:</strong> ${studentId}</p>
              <p><strong>Login Email:</strong> ${normalizedEmail}</p>
              <p><strong>Temporary Password:</strong> ${password}</p>
            </div>

            <p>Please log in and change your password after your first login.</p>
            <p>Keep your login credentials confidential.</p>
            <p>Regards,<br/><strong>HM Dance Studio</strong></p>
          </div>
        `,
      });

      emailSent = true;
    } catch (mailError) {
      console.error("Admission Email Error:", mailError.message);
      emailError = "Admission created, but credentials email could not be sent.";
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Admission created and login credentials emailed successfully"
        : "Admission created, but email could not be sent",
      emailSent,
      emailError,
      student: {
        id: createdStudent._id,
        studentId: createdStudent.studentId,
        name: createdStudent.name,
        email: createdStudent.email,
        admissionDate: createdStudent.admissionDate,
      },
    });
  } catch (error) {
    // Remove partially created records if admission creation fails
    if (createdStudent) {
      await Student.findByIdAndDelete(createdStudent._id);
    }

    if (createdUser) {
      await User.findByIdAndDelete(createdUser._id);
    }

    console.error("Student Admission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create student admission",
    });
  }
};




const getMyProfile = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      student: {
        studentId: student.studentId,
        name: student.name,
        fatherName: student.fatherName,
        motherName: student.motherName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        phone: student.phone,
        parentPhone: student.parentPhone,
        email: student.email,
        presentAddress: student.presentAddress,
        permanentAddress: student.permanentAddress,
        admissionDate: student.admissionDate,
      },
    });
  } catch (error) {
    console.error("Student Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch student profile",
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-aadhaarNumber")
      .populate("user", "isActive")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error("Get Students Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch students",
    });
  }
};


const searchStudents = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || !search.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    const keyword = search.trim();

    const students = await Student.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { studentId: { $regex: keyword, $options: "i" } },
      ],
    })
      .select("-aadhaarNumber")
      .populate("user", "isActive")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error("Search Students Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Student search failed",
    });
  }
};


const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const allowedFields = [
      "name",
      "fatherName",
      "motherName",
      "dateOfBirth",
      "gender",
      "aadhaarNumber",
      "phone",
      "parentPhone",
      "email",
      "presentAddress",
      "permanentAddress",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    // Normalize text fields
    if (updates.name) updates.name = updates.name.trim();
    if (updates.email) {
      updates.email = updates.email.trim().toLowerCase();
    }

    // Validate Aadhaar
    if (
      updates.aadhaarNumber &&
      !/^\d{12}$/.test(updates.aadhaarNumber)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar number",
      });
    }

    // Validate mobile numbers
    if (updates.phone && !/^\d{10}$/.test(updates.phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student mobile number",
      });
    }

    if (
      updates.parentPhone &&
      !/^\d{10}$/.test(updates.parentPhone)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent mobile number",
      });
    }

    // Find student first
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Find linked user
    const user = await User.findById(student.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student login account not found",
      });
    }

    // Check duplicate email BEFORE updating anything
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    // Update linked User account
    if (updates.name !== undefined) {
      user.name = updates.name;
    }

    if (updates.email !== undefined) {
      user.email = updates.email;
    }

    // Update Student profile
    Object.assign(student, updates);

    await user.save();
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: {
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        fatherName: student.fatherName,
        motherName: student.motherName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        phone: student.phone,
        parentPhone: student.parentPhone,
        presentAddress: student.presentAddress,
        permanentAddress: student.permanentAddress,
        admissionDate: student.admissionDate,
      },
    });
  } catch (error) {
    console.error("Update Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update student",
    });
  }
};

const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      student.user,
      { $set: { isActive } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Student account activated successfully"
        : "Student account blocked successfully",
      studentId,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error("Student Status Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update student status",
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.params.studentId,
    })
      .select("-aadhaarNumber")
      .populate("user", "name email isActive");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get Student Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch student details",
    });
  }
};

module.exports = {
  createStudent,
  getMyProfile,
  getAllStudents,
  searchStudents,
  updateStudent,
  updateStudentStatus,
  getStudentById,
};
