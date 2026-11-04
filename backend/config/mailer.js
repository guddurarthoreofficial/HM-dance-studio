
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  sendMail: async (mailOptions) => {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing");
    }

    const {
      to,
      cc,
      bcc,
      replyTo,
      subject,
      html,
      text,
      attachments = [],
    } = mailOptions;

    const resendAttachments = attachments.map((attachment) => {
      const { filename, content, path } = attachment;

      if (content !== undefined) {
        return {
          filename,
          content: Buffer.isBuffer(content)
            ? content.toString("base64")
            : content,
        };
      }

      if (path && /^https?:\/\//i.test(path)) {
        return { filename, path };
      }

      throw new Error(
        `Unsupported email attachment: ${filename || "unknown"}`
      );
    });

    const emailData = {
      from:
        process.env.RESEND_FROM_EMAIL ||
        "HM Dance Studio <noreply@hmdance.shiulitech.in>",
      to: Array.isArray(to) ? to : [to],
      subject,
    };

    if (html) emailData.html = html;
    if (text) emailData.text = text;
    if (cc) emailData.cc = cc;
    if (bcc) emailData.bcc = bcc;
    if (replyTo) emailData.replyTo = replyTo;

    if (resendAttachments.length > 0) {
      emailData.attachments = resendAttachments;
    }

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      throw new Error(
        `Email sending failed: ${error.message || "Unknown error"}`
      );
    }

    return {
      messageId: data.id,
      accepted: emailData.to,
    };
  },
};

module.exports = transporter;
