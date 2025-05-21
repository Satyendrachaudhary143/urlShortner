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

export const ChangePasswordAlrt = async (email, user) => {
  const mailOptions = {
    from: `"MIP Technology" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Change Password Alert',
    html: `
     <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #E60000;">Change Password Alert</h2>
        <p>Dear ${user},</p>
        <p>Your password has been successfully changed. </p>
        <p>If you did not initiate this change, please contact us immediately.</p>
        <p>Thank you for being a part of our community!</p>
        <p>Best regards,<br><b>Satyendra Chaudhary<b><br> <b>MIP Technology</b></p>
      </div>
    </div>
    `
   
  };

  await transporter.sendMail(mailOptions);
};