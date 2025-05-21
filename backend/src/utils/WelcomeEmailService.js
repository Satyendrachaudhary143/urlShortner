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

export const sendWelcomeEmail = async (email, user) => {
  const mailOptions = {
    from: `"MIP Technology" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to MIP Technology!',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Welcome to Our Community!</h2>
        <p style="color: #555;">Dear ${user} </p>
        <p style="color: #555;">Your account has been successfully created.</p>
        <p>Thanks for connecting with <b>MIP Technology</b>, we strive to provide you with the best experience possible.</p>
        <p>Feel free to explore, connect, and make the most of our services.</p>
        <p>Need help? Reach out to us anytime!</p>
        <hr style="border: none; border-bottom: 1px solid #ccc;">
        <p>Best regards,<br><b>Satyendra Chaudhary<b><br> <b>MIP Technology</b></p>
    </div>
</div>

    `
  };

  await transporter.sendMail(mailOptions);
};