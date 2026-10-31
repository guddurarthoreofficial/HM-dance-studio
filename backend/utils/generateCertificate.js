
const PDFDocument = require("pdfkit");

const generateCertificate = async ({
  studentName,
  courseName,
  durationMonths,
  completionDate,
  certificateNumber,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 40,
      });

      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const width = doc.page.width;
      const height = doc.page.height;

      // Background
      doc.rect(0, 0, width, height).fill("#fffdf7");

      // Outer border
      doc.lineWidth(5)
        .strokeColor("#b38b35")
        .rect(20, 20, width - 40, height - 40)
        .stroke();

      doc.lineWidth(1)
        .strokeColor("#b38b35")
        .rect(30, 30, width - 60, height - 60)
        .stroke();

      // Studio name
      doc.fillColor("#172033")
        .font("Helvetica-Bold")
        .fontSize(28)
        .text("HM DANCE STUDIO", 50, 75, {
          align: "center",
        });

      doc.fillColor("#a17b2d")
        .font("Helvetica")
        .fontSize(13)
        .text("CERTIFICATE OF COMPLETION", 50, 125, {
          align: "center",
          characterSpacing: 2,
        });

      doc.moveTo(220, 160)
        .lineTo(width - 220, 160)
        .strokeColor("#b38b35")
        .stroke();

      // Main heading
      doc.fillColor("#172033")
        .font("Helvetica-Bold")
        .fontSize(34)
        .text("Certificate of Achievement", 50, 185, {
          align: "center",
        });

      doc.fillColor("#555555")
        .font("Helvetica")
        .fontSize(16)
        .text("This certificate is proudly presented to", 50, 245, {
          align: "center",
        });

      // Student name
      doc.fillColor("#a17b2d")
        .font("Helvetica-Bold")
        .fontSize(32)
        .text(studentName, 60, 280, {
          align: "center",
        });

      doc.fillColor("#555555")
        .font("Helvetica")
        .fontSize(16)
        .text("for successfully completing the dance course", 50, 335, {
          align: "center",
        });

      // Course details
      doc.fillColor("#172033")
        .font("Helvetica-Bold")
        .fontSize(21)
        .text(courseName, 50, 370, {
          align: "center",
        });

      doc.fillColor("#555555")
        .font("Helvetica")
        .fontSize(15)
        .text(`Course Duration: ${durationMonths} Months`, 50, 410, {
          align: "center",
        });

      const formattedDate = new Date(completionDate).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

      doc.text(`Completion Date: ${formattedDate}`, 50, 440, {
        align: "center",
      });

      // Certificate number
      doc.fillColor("#172033")
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(`Certificate No: ${certificateNumber}`, 50, 495, {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificate;
