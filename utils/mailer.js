// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // or use SMTP host if you're not using Gmail
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASS, // your email app password or SMTP password
  },
});

/**
 * Send email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - HTML body
 */
async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };
