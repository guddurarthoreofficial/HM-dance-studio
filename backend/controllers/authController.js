
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Generate JWT
// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       role: user.role
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );
// };

// // Login Admin / Student
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required"
//       });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase().trim()
//     }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password"
//       });
//     }

//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is blocked. Contact the administrator."
//       });
//     }

//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password"
//       });
//     }

//     const token = generateToken(user);

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         studentId: user.studentId || null,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error("Login Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error during login"
//     });
//   }
// };



// const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "All password fields are required"
//       });
//     }

//     if (newPassword.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: "New password must be at least 8 characters"
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New password and confirm password do not match"
//       });
//     }

//     if (currentPassword === newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New password must be different from current password"
//       });
//     }

//     const user = await User.findById(req.user._id).select("+password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User account not found"
//       });
//     }

//     const isMatch = await user.comparePassword(currentPassword);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Current password is incorrect"
//       });
//     }

//     user.password = newPassword;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password changed successfully. Please log in again."
//     });

//   } catch (error) {
//     console.error("Change Password Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to change password"
//     });
//   }
// };



const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const transporter = require("../config/mailer");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Hash OTP
const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// Login Admin / Student
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Contact the administrator."
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId || null,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password"
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found"
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again."
    });

  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password"
    });
  }
};

// Step 1: Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail })
      .select("+resetPasswordOTP +resetPasswordOTPExpiry +resetPasswordVerified");

    // Generic response prevents account enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email is registered, an OTP will be sent."
      });
    }

    if (!user.isActive) {
      return res.status(200).json({
        success: true,
        message: "If the email is registered, an OTP will be sent."
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    user.resetPasswordOTP = hashOTP(otp);
    user.resetPasswordOTPExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.resetPasswordVerified = false;

    await user.save();

    try {
      await transporter.sendMail({
        from: `"HM Dance Studio" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Password Reset OTP - HM Dance Studio",
        text: `Hello ${user.name},

Your password reset OTP is: ${otp}

This OTP is valid for 5 minutes.

If you did not request this password reset, please ignore this email.

Regards,
HM Dance Studio`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;border:1px solid #eee;border-radius:12px;color:#222">
            <h2 style="color:#6d28d9">Password Reset Request</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Use the following OTP to reset your password:</p>
            <div style="background:#f5f3ff;padding:20px;text-align:center;border-radius:8px">
              <h1 style="letter-spacing:8px;color:#6d28d9">${otp}</h1>
            </div>
            <p>This OTP expires in <strong>5 minutes</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Regards,<br/><strong>HM Dance Studio</strong></p>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Password Reset Email Error:", mailError.message);

      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpiry = undefined;
      user.resetPasswordVerified = false;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP email. Please try again."
      });
    }

    return res.status(200).json({
      success: true,
      message: "If the email is registered, an OTP will be sent."
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request"
    });
  }
};

// Step 2: Verify OTP
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+resetPasswordOTP +resetPasswordOTPExpiry +resetPasswordVerified");

    if (
      !user ||
      !user.isActive ||
      !user.resetPasswordOTP ||
      !user.resetPasswordOTPExpiry ||
      user.resetPasswordOTPExpiry.getTime() < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid or expired. Please request a new OTP."
      });
    }

    const submittedHash = hashOTP(String(otp));

    const storedHash = Buffer.from(user.resetPasswordOTP, "hex");
    const submittedBuffer = Buffer.from(submittedHash, "hex");

    const isValid =
      storedHash.length === submittedBuffer.length &&
      crypto.timingSafeEqual(storedHash, submittedBuffer);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP"
      });
    }

    user.resetPasswordVerified = true;
    await user.save();

    const resetToken = jwt.sign(
      {
        id: user._id,
        purpose: "password-reset"
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP"
    });
  }
};

// Step 3: Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;

    if (!email || !resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Reset token is invalid or expired. Request a new OTP."
      });
    }

    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({
        success: false,
        message: "Invalid password reset token"
      });
    }

    const user = await User.findOne({
      _id: decoded.id,
      email: email.trim().toLowerCase()
    }).select("+password +resetPasswordOTP +resetPasswordOTPExpiry +resetPasswordVerified");

    if (!user || !user.isActive || !user.resetPasswordVerified) {
      return res.status(400).json({
        success: false,
        message: "Password reset verification is required"
      });
    }

    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password"
      });
    }

    user.password = newPassword;

    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.resetPasswordVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login with your new password."
    });

  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password"
    });
  }
};

module.exports = {
  login,
  changePassword,
  forgotPassword,
  verifyResetOTP,
  resetPassword
};
