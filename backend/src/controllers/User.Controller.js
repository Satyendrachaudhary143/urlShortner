import { User } from "../models/User.Model.js";
import { Otp } from "../models/Otp.Model.js";
import { sendOtpEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../utils/WelcomeEmailService.js";
import { ChangePasswordAlrt } from "../utils/ChangePasswordEmailService.js";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email, verified: true });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // check if email is not verified
    const unverifiedUser = await User.findOne({ email, verified: false });
    if (unverifiedUser) {
      const DeleteUnverifiedUser = await User.findOneAndDelete({ email, verified: false });
      if (!DeleteUnverifiedUser) {
        console.log('Error deleting unverified user:', email);
        return res.status(400).json({ message: "Error deleting unverified user" });
      }
    }

    // Create new user
    console.log('Creating new user:', email);
    const newUser = await User.create({ name, email, password, verified: false });
    await newUser.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP
    await Otp.create({ email, otp, expiresAt });

    // Send OTP email
    await sendOtpEmail(email, otp);

    console.log('Registration successful for:', email);
    res.status(201).json({ message: "Otp send successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "Server error by registering", 
      error: error.message 
    });
  }
}

export const VerifyUser = async (req, res) => {
   try {
    const { email, otp } = req.body;
     console.log("email :", email, "otp", otp);

    // Find valid OTP
    const otpRecord = await Otp.findOne({
      email,
      otp,
      // expiresAt: { $gt: new Date() },
      verified: false
    });
     console.log(otpRecord);


    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Verify user
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { verified: true } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
     }
    await sendWelcomeEmail(user.email, user.name); // Send welcome email

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const ResendOtp = async (req, res) => { 
   try {
    const { email } = req.body;

    // Delete existing OTPs
    await Otp.deleteMany({ email });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save new OTP
    await Otp.create({ email, otp, expiresAt });

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: 'New OTP sent' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.verified === false) {
      const deleteUser = await User.findOneAndDelete({ email, verified: false });

      return res.status(400).json({ message: "User not verified register again!" });
    }
    // Check password
    if (user.password != password) {
      return res.status(400).json({ message: "Invalid credencial" });
    }

    const scret_Key = process.env.JWT_SECRET;
    if (!scret_Key) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({
      user: {
        _id: user._id,
        email: user.email,
      }
    }, scret_Key, { expiresIn: "7d" });
    // Send token in response
    res.cookie("token", token, { 
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000,

      sameSite: 'none',
      secure: true,
    });
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error by logging in" });
  }
}

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error by logging out" });
    console.log(error);
  }
}

export const GetUser = async (req, res) => {
  const userId = req.user._id;// Assuming you have middleware to set req.user from the token

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error by fetching user" });
    console.log(error);
  }

}

// 1. Request OTP for password reset
export const ForgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email, verified: true });
    if (!user) return res.status(404).json({ message: "User not found or not verified" });

    // Delete old OTPs
    await Otp.deleteMany({ email });

    // Generate and save new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await Otp.create({ email, otp, expiresAt, verified: false });

    // Send OTP
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error sending OTP" });
    console.log(error);
  }
};

// 2. Verify OTP for password reset
export const ForgotPasswordVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const otpRecord = await Otp.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() },
      verified: false
    });

    if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

    otpRecord.verified = true;
    await otpRecord.save();

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error verifying OTP" });
    console.log(error);
  }
};

// 3. Reset password after OTP verification
export const ForgotPasswordReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    // Check OTP is verified
    const otpRecord = await Otp.findOne({ email, otp, verified: true });
    if (!otpRecord) return res.status(400).json({ message: "OTP not verified" });

    // Update password
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: newPassword } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optionally delete OTP after use
    await Otp.deleteMany({ email });

    await ChangePasswordAlrt(user.email, user.name); // Send password change alert email

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error resetting password" });
    console.log(error);
  }
};



