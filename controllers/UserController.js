const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔹 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();
    return res.status(200).send({
      success: true,
      message: "All users fetched successfully",
      userCount: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};

// 🔹 Register user (no OTP/email verification here)
exports.registerController = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userSchema({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'User',
      approved: true, // Optional: auto-approved for now
      emailVerified: true // Optional: assuming no OTP in this version
    });

    await newUser.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

// 🔹 Login user
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).send({
        success: false,
        message: "Email not verified",
      });
    }

    if (!user.approved) {
      return res.status(403).send({
        success: false,
        message: "Admin approval pending",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred during login",
      error: error.message,
    });
  }
};
