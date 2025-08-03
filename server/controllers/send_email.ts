import { Request, Response } from "express";
import { sendAlertEmail } from "../services/sendMail";

const handleSendAlertEmail = async (req: Request, res: Response) => {
  try {
    const { subject, text, html } = req.body;
    const data = await sendAlertEmail(subject, text, html);

    res.status(200).json(data);
  } catch (e) {
    console.error("Lỗi trong controller handleSendAlertEmail:", e);
    res.status(500).json({
      message: "Lỗi server khi gửi email",
    });
  }
};

export { handleSendAlertEmail };
