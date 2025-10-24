import nodemailer from 'nodemailer';
import { setDataInRedis } from './redis.service.js';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

export const sendEmail = async (data) => {
  const mailOptions = {
    from: `${process.env.EMAIL}`,
    to: data.email,
    subject: 'Verification Code',
    text: `${data.otp} is your OTP. It is valid for 5 minutes.`,
    html: `<p><strong>${data.otp}</strong> is your OTP. It is valid for 5 minutes.</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    await setDataInRedis(data.email, data.otp);
    console.log('✅ Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};
