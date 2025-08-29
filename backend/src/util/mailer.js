const nodemailer = require("nodemailer");

// Create a reusable transporter object using Gmail SMTP
// - host: Gmail SMTP server
// - port: 587 (TLS/STARTTLS)
// - secure: false (because we are using TLS, not SSL port 465)
// - auth: requires your email & app-specific password (NOT your Gmail password directly)
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MY_EMAIL, // your email from environment variable
    pass: process.env.MY_EMAIL_PASS, // app password from environment variable
  },
});

/**
 * Sends an OTP email for verification using nodemailer.
 *
 * @param {string} to - The recipient email address.
 * @param {string} text - The OTP message (plain text).
 * @returns {Promise<void>}
 *
 * Example:
 * await sendOTP("user@example.com", "Your OTP is 123456");
 */
const sendOTP = async (to, otp) => {
  const info = await transport.sendMail({
    from: `"AlphaPay" <${process.env.MY_EMAIL}>`, // Sender name & email
    to: to, // Recipient email
    subject: "Email verification OTP", // Email subject
    text: `Your OTP code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">🔒 AlphaPay Verification</h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">
          Please use the following OTP to verify your email address:
        </p>
        <h1 style="text-align: center; color: #000; background: #f2f2f2; padding: 10px; border-radius: 8px;">
          ${otp}
        </h1>
        <p style="font-size: 14px; color: #777; margin-top: 20px;">
          This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.
        </p>
        <p style="font-size: 14px; color: #555;">– The AlphaPay Team</p>
      </div>
    `,
  });

  // log messageId for debugging
  console.log("OTP email sent: %s", info.messageId);
};

/**
 * Sends a review notification email using nodemailer.
 *
 * @param {string} to - The recipient email address.
 * @param {Object} review - The review object containing message and rating.
 * @returns {Promise<void>}
 *
 * Example:
 * await sendReview("developer@example.com", { message: "Great job!", rating: 5 });
 */
const sendReview = async (to, review) => {
  const info = await transport.sendMail({
    from: `"AlphaPay" <${process.env.MY_EMAIL}>`, // Sender name & email
    to: to, // Recipient email
    subject: "New Review Received", // Email subject
    text: `You have received a new review: ${review.message} with rating ${review.rating}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">📢 New Review Received</h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">
          You have received a new review:
        </p>
        <blockquote style="font-size: 14px; color: #555; border-left: 4px solid #4CAF50; padding-left: 10px;">
          "${review.message}"
        </blockquote>
        <p style="font-size: 14px; color: #777; margin-top: 20px;">
          Rating: <b>${review.rating}</b>
        </p>
        <p style="font-size: 14px; color: #555;">– The AlphaPay Team</p>
      </div>
    `,
  });

  // log messageId for debugging
  console.log("Review email sent: %s", info.messageId);
};

module.exports = { sendOTP, sendReview };
