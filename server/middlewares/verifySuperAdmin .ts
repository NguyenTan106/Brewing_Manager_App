// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./verifyToken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Giả sử req.user đã được decode từ token JWT
export const verifySuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const totalUsers = await prisma.user.count();

  // ✅ Nếu chưa có người dùng nào → cho phép tạo không cần xác thực
  if (totalUsers === 0) {
    return next();
  }

  const user = (req as AuthenticatedRequest).user; // lấy từ middleware xác thực JWT trước đó
  if (!user || user.role !== "SUPER_ADMIN") {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền dùng chức năng này" });
  }
  next();
};
