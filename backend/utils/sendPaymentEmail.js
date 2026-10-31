
const transporter = require("../config/mailer");

const sendPaymentEmail = async ({
  email,
  studentName,
  receiptNumber,
  amount,
  pdfBuffer
}) => {
  return transporter.sendMail({
    from: `"HM Dance Studio" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "HM Dance Studio - Fee Payment Confirmation",

    text: `
Hello ${studentName},

Your fee payment has been successfully received.

Receipt Number: ${receiptNumber}
Amount Paid: Rs. ${amount}

Your fee receipt is attached to this email.

Thank you,
HM Dance Studio
    `,

    attachments: [
      {
        filename: `${receiptNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf"
      }
    ]
  });
};

module.exports = sendPaymentEmail;
