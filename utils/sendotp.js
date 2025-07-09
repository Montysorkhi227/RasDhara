const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  const mailOptions = {
    from: `"RasDhara App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: '🔐 Your OTP for RasDhara App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #4CAF50; color: #fff; text-align: center; padding: 20px;">
          <h1 style="margin: 0;">RasDhara</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello 👋,</h2>
          <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for verifying your email address is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; color: #4CAF50; letter-spacing: 2px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone for security reasons.</p>
          <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
        </div>
        <div style="background: #4CAF50; color: #fff; text-align: center; padding: 10px;">
          <p style="margin: 0; font-size: 14px;">&copy; ${new Date().getFullYear()} RasDhara App</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent: ", info.response);
  } catch (error) {
    console.error("❌ OTP failed:", error);
  }
};

module.exports = sendOtpEmail;
