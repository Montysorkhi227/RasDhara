const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Your OTP for RasDhara App',
    text: `Your OTP is: ${otp}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent: ", info.response);
  } catch (error) {
    console.error("❌ OTP failed:", error);
  }
};

module.exports = sendOtpEmail;
