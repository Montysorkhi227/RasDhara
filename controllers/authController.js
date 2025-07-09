const sendOtpEmail = require("../utils/sendotp");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ success: false, message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendOtpEmail(email, otp);
    res.status(200).send({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Failed to send OTP",
      error: err.message
    });
  }
};