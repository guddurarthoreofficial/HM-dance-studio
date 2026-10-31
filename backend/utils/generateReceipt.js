
const PDFDocument = require("pdfkit");

const generateReceipt = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50
      });

      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Studio Header
      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("HM DANCE STUDIO", { align: "center" });

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Where passion becomes performance.", {
          align: "center"
        });

      doc.moveDown(0.5);

      doc
        .fontSize(10)
        .text(
          "Chandmari Golamber, Near Hanuman Mandir, Motihari, Bihar - 845401",
          { align: "center" }
        );

      doc.moveDown(1);

      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("FEE PAYMENT RECEIPT", { align: "center" });

      doc.moveDown(1.5);

      // Receipt Details
      const details = [
        ["Receipt Number", data.receiptNumber],
        ["Student Name", data.studentName],
        ["Student ID", data.studentId],
        ["Email", data.email],
        ["Package", data.packageName],
        ["Dance Style", data.danceStyle],
        ["Payment Date", new Date(data.paymentDate).toLocaleDateString("en-IN")],
        ["Payment Mode", data.paymentMode.toUpperCase()]
      ];

      doc.fontSize(11).font("Helvetica");

      details.forEach(([label, value]) => {
        doc
          .font("Helvetica-Bold")
          .text(`${label}: `, { continued: true });

        doc
          .font("Helvetica")
          .text(String(value));
        
        doc.moveDown(0.5);
      });

      doc.moveDown(1);

      doc
        .fontSize(15)
        .font("Helvetica-Bold")
        .text(`Total Amount Paid: Rs. ${data.amount}`);

      doc.moveDown(2);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Payment successfully received. Thank you!", {
          align: "center"
        });

      doc.moveDown(2);

      doc
        .fontSize(10)
        .text("Authorized Signature", {
          align: "right"
        });

      doc
        .moveDown(3)
        .fontSize(9)
        .text("This is a computer-generated payment receipt.", {
          align: "center"
        });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateReceipt;
