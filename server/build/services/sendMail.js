"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAlertEmail = void 0;
// sendMail.js
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendAlertEmail = async (subject, text, html) => {
    const transporter = nodemailer_1.default.createTransport({
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
exports.sendAlertEmail = sendAlertEmail;
