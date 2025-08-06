"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAlertEmailService = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const send_email_1 = require("../controllers/send_email");
exports.sendAlertEmailService = router.post("/send-email", send_email_1.handleSendAlertEmail);
