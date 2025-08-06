"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySuperAdmin = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Giả sử req.user đã được decode từ token JWT
const verifySuperAdmin = async (req, res, next) => {
    const totalUsers = await prisma.user.count();
    // ✅ Nếu chưa có người dùng nào → cho phép tạo không cần xác thực
    if (totalUsers === 0) {
        return next();
    }
    const user = req.user; // lấy từ middleware xác thực JWT trước đó
    if (!user || user.role !== "SUPER_ADMIN") {
        return res
            .status(403)
            .json({ message: "Bạn không có quyền dùng chức năng này" });
    }
    next();
};
exports.verifySuperAdmin = verifySuperAdmin;
