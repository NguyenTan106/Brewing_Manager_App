"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSendAlertEmail = void 0;
const sendMail_1 = require("../services/sendMail");
const handleSendAlertEmail = async (req, res) => {
    try {
        const { subject, text, html } = req.body;
        const data = await (0, sendMail_1.sendAlertEmail)(subject, text, html);
        res.status(200).json(data);
    }
    catch (e) {
        console.error("Lỗi trong controller handleSendAlertEmail:", e);
        res.status(500).json({
            message: "Lỗi server khi gửi email",
        });
    }
};
exports.handleSendAlertEmail = handleSendAlertEmail;
