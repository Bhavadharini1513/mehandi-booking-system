const nodemailer = require("nodemailer");

/*
  Mailer (Nodemailer)
  -------------------
  * If SMTP_HOST / SMTP_USER / SMTP_PASS are set in .env, real e-mails are sent.
  * Otherwise the e-mail is only printed in the server console, so the whole
    project (including "forgot password") can be demonstrated without any
    e-mail account.

  sendMail() never throws - a mail problem must not break an API request.
*/

const isConfigured = () =>
  Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const printMail = ({ to, subject, text, html }) => {
  console.log("\n==================== DEV E-MAIL ====================");
  console.log(`To      : ${to}`);
  console.log(`Subject : ${subject}`);
  console.log(text || html);
  console.log("====================================================\n");
};

const sendMail = async ({ to, subject, text, html }) => {
  try {
    if (!to) return false;

    if (!isConfigured()) {
      printMail({ to, subject, text, html });
      return true;
    }

    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || `"Maruthani World" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return true;
  } catch (error) {
    console.error("MAIL ERROR (e-mail was NOT sent):", error.message);

    // while developing, still show the content so the flow can be tested
    if (process.env.NODE_ENV !== "production") {
      printMail({ to, subject, text, html });
    }

    return false;
  }
};

module.exports = { sendMail, isConfigured };
