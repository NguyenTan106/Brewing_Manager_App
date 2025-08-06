"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Bạn cần đảm bảo đã có .env với JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET=super_secret_2025_brewing_token!@#$";
const verifyToken = async (req, res, next) => {
    const totalUsers = await prisma.user.count();
    // console.log(totalUsers);
    // ✅ Nếu chưa có người dùng nào → cho phép tạo không cần xác thực
    if (totalUsers === 0) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Ép kiểu tại đây để gắn vào req
        req.user = decoded;
        // console.log((req as AuthenticatedRequest).user);
        next();
    }
    catch (err) {
        return res
            .status(403)
            .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};
exports.verifyToken = verifyToken;
