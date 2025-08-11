// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // or use SMTP host if you're not using Gmail
  auth: {
    user: process.env.NODEMAILER_USER, 
    pass: process.env.NODEMAILER_PASS, 
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
    from:"venkataraviraja5@gmail.com",
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };
