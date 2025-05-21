import { User } from "../models/User.Model.js";
import { Otp } from "../models/Otp.Model.js";
import { sendOtpEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email,verified:true });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // check if email is not verified
    const unverifiedUser = await User.findOne({ email, verified: false });
    
    if (unverifiedUser) {
      console.log("he from delete unverified user",DeleteUnverifiedUser);
      const DeleteUnverifiedUser = await User.findOneAndDelete({ email,verified:false });
      if (!DeleteUnverifiedUser) {
        
        return res.status(400).json({ message: "Error deleting unverified user" });
      }
      return res.status(400).json({ message: "User already exists but not verified" });
    }
    // Create new user
    const newUser = await User.create({ name, email, password, verified: false });
    newUser.save();
    // await User({ name, email, password ,verified:false });
   // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP
    await Otp.create({ email, otp, expiresAt });

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error by registering", error });
    console.log(error);
    
  }
}

export const VerifyUser = async (req, res) => {
   try {
    const { email, otp } = req.body;

    // Find valid OTP
    const otpRecord = await Otp.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() },
      verified: false
    });

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
    // Check password
    if (user.password != password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const scret_Key = process.env.JWT_SECRET;
    const token = jwt.sign({user}, scret_Key, { expiresIn: "7d" });
    // Send token in response
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error by logging in" });
    console.log(error);
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
const userId = req.id; // Assuming you have middleware to set req.user from the token
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

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error resetting password" });
    console.log(error);
  }
};



