const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: Number, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['User'], default: 'User' }, 
  approved: { type: Boolean, default: true },
  profileImage: String,
  otp: String,
  otpExpires: Date,
  emailVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
