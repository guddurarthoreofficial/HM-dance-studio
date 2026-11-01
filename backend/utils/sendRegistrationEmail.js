
const transporter = require("../config/mailer");

const sendRegistrationEmail = async (registration) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  // Student confirmation email
  const studentMail = {
    from: `"HM Dance Studio" <${process.env.SMTP_USER}>`,
    to: registration.email,
    subject: "Registration Received - HM Dance Studio",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #d7b46b;">HM Dance Studio</h2>
        <h3>Registration Successfully Received!</h3>
        <p>Dear ${registration.studentName},</p>
        <p>Thank you for registering with HM Dance Studio.</p>
        <p>We have successfully received your registration details. Our team will review your application and contact you soon.</p>
        <p><strong>Registration Status:</strong> Pending Review</p>
        <p>Regards,<br/>HM Dance Studio Team</p>
      </div>
    `,
  };

  // Admin notification email
  const adminMail = {
    from: `"HM Dance Studio" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: "New Student Registration Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #d7b46b;">New Student Registration</h2>
        <p>A new registration has been submitted.</p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><b>Student Name</b></td><td>${registration.studentName}</td></tr>
          <tr><td><b>Father's Name</b></td><td>${registration.fatherName}</td></tr>
          <tr><td><b>Mother's Name</b></td><td>${registration.motherName}</td></tr>
          <tr><td><b>Date of Birth</b></td><td>${new Date(registration.dateOfBirth).toLocaleDateString("en-IN")}</td></tr>
          <tr><td><b>Student Mobile</b></td><td>${registration.studentMobile}</td></tr>
          <tr><td><b>Parent Mobile</b></td><td>${registration.parentMobile}</td></tr>
          <tr><td><b>Email</b></td><td>${registration.email}</td></tr>
          <tr><td><b>Gender</b></td><td>${registration.gender}</td></tr>
          <tr><td><b>Current Address</b></td><td>${registration.currentAddress}</td></tr>
          <tr><td><b>Permanent Address</b></td><td>${registration.permanentAddress}</td></tr>
        </table>

        <p><strong>Status:</strong> Pending Review</p>
        <p>Please review this registration from the Admin Dashboard.</p>
      </div>
    `,
  };

  await Promise.all([
    transporter.sendMail(studentMail),
    transporter.sendMail(adminMail),
  ]);
};

module.exports = sendRegistrationEmail;
