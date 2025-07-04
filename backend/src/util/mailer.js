const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASS,
  },
});

const sendOTP = async (to, text) => {
  const info = await transport.sendMail({
    from: `"AlphaPay" <${process.env.MY_EMAIL}>`,
    to: to,
    subject: "Email verification OTP",
    text: text,
  });
  console.log("Message sent: ", info.messageId);
};

module.exports = sendOTP;
