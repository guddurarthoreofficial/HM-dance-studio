
const transporter = require("../config/mailer");

const sendCertificateEmail = async ({
  email,
  studentName,
  courseName,
  certificateNumber,
  pdfBuffer,
}) => {
  return transporter.sendMail({
    from: `"HM Dance Studio" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Congratulations! Your HM Dance Studio Certificate",
    text: `
Hello ${studentName},

Congratulations!

You have successfully completed your dance course.

Course: ${courseName}
Certificate Number: ${certificateNumber}

Your certificate is attached to this email as a PDF.

Thank you for being a part of HM Dance Studio.

Best Regards,
HM Dance Studio
    `,
    attachments: [
      {
        filename: `${certificateNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};

module.exports = sendCertificateEmail;
