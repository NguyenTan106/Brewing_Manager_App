import express from "express";
const router = express.Router();

import { handleSendAlertEmail } from "../controllers/send_email";

export const sendAlertEmailService = router.post(
  "/send-email",
  handleSendAlertEmail
);
