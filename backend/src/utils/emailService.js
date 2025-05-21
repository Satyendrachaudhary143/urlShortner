import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"MIP App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="font-size: 2.5rem; letter-spacing: 0.5rem; color: #2563eb;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};