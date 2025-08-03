// sendMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendAlertEmail = async (
  subject: string,
  text: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const data = await transporter.sendMail({
    from: `"Hệ thống nấu bia" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject,
    text,
    html,
  });

  console.log("📧 Đã gửi cảnh báo qua email!");
  return {
    message: "Gửi email thành công",
    data: data,
  };
};
