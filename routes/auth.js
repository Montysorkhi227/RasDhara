const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../modals/UserModals');
const sendOtpEmail = require('../utils/sendotp');
const upload = require('../Middleware/Multer');

// Generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🟢 Signup Route (with profile image upload)
router.post('/signup', upload.single('rasdhara_users'), async (req, res) => {
  const { name, phone, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ $or: [{ phone }, { email }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 min

    let profileImageUrl = ''; // Cloudinary image URL
    if (req.file && req.file.path) {
      profileImageUrl = req.file.path; // Multer + Cloudinary gives us .path
    }

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: role || 'User',
      profileImage: profileImageUrl,
      otp,
      otpExpires
    });

    await newUser.save();
    await sendOtpEmail(email, otp);

    res.status(201).json({
      success: true,
      message: 'Signup successful. OTP sent to email.'
    });
  } catch (error) {
    console.error('Signup failed:', error);
    res.status(500).json({ success: false, message: 'Signup failed. Try again later.' });
  }
});

// 🟢 Verify OTP Route
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ error: 'Already verified' });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.emailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'OTP verified, email verified successfully' });
  } catch (error) {
    console.error('OTP verification failed:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// 🟢 Login Route
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.emailVerified) return res.status(403).json({ error: 'Email not verified' });
    if (!user.approved) return res.status(403).json({ error: 'Admin approval pending' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
