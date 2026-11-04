/*
  Checks the e-mail settings in .env and tells you exactly what is wrong.

    npm run test-mail                  -> sends a test mail to SMTP_USER
    npm run test-mail you@example.com  -> sends it to another address
*/
require("dotenv").config();
const nodemailer = require("nodemailer");

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

const show = (label, value) => console.log(`${label.padEnd(10)}: ${value}`);

console.log("\n--- E-mail settings read from .env ---");
show("SMTP_HOST", SMTP_HOST || "(EMPTY)");
show("SMTP_PORT", SMTP_PORT || "(EMPTY - 587 will be used)");
show("SMTP_USER", SMTP_USER || "(EMPTY)");
show("SMTP_PASS", SMTP_PASS ? `${SMTP_PASS.length} characters` : "(EMPTY)");

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.log(
    "\nPROBLEM: SMTP_HOST, SMTP_USER or SMTP_PASS is empty in backend\\.env",
  );
  process.exit(1);
}

if (SMTP_PASS.length !== 16 && SMTP_HOST.includes("gmail")) {
  console.log(
    `\nWARNING: a Gmail app password has exactly 16 letters, yours has ${SMTP_PASS.length}.` +
      "\n         Remove spaces/quotes, or create a new app password.",
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  connectionTimeout: 15000,
});

(async () => {
  try {
    console.log("\nConnecting and logging in...");
    await transporter.verify();
    console.log("OK: login accepted by the mail server");

    const to = process.argv[2] || SMTP_USER;

    await transporter.sendMail({
      from: `"Maruthani World" <${SMTP_USER}>`,
      to,
      subject: "Maruthani World - test mail",
      text: "If you can read this, e-mail sending works.",
    });

    console.log(`OK: test mail sent to ${to}  (check Inbox and Spam)\n`);
  } catch (error) {
    console.log("\nFAILED:", error.message);
    console.log("Code  :", error.code, error.responseCode || "");

    if (error.code === "EAUTH" || error.responseCode === 535) {
      console.log(`
Gmail refused the login. Fix:
 1. Your normal Gmail password does NOT work here. Use an APP PASSWORD.
 2. Turn on 2-Step Verification: https://myaccount.google.com/security
 3. Create the app password:    https://myaccount.google.com/apppasswords
 4. Put the 16 letters in SMTP_PASS with NO spaces and NO quotes.
 5. SMTP_USER must be the same Gmail account that made the app password.
 6. Save .env and run this test again.`);
    } else if (
      ["ETIMEDOUT", "ECONNECTION", "ESOCKET", "ENOTFOUND", "EDNS"].includes(
        error.code,
      )
    ) {
      console.log(`
Could not reach the mail server. Check:
 - internet connection
 - college / office Wi-Fi may block port 587 -> try a mobile hotspot
 - antivirus / firewall blocking Node.js
 - or try SMTP_PORT=465`);
    }
    process.exit(1);
  }
})();
