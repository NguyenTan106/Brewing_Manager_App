import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Bạn cần đảm bảo đã có .env với JWT_SECRET
const JWT_SECRET =
  process.env.JWT_SECRET || "JWT_SECRET=super_secret_2025_brewing_token!@#$";

export interface AuthenticatedRequest extends Request {
  user: JwtUserPayload;
}

export interface JwtUserPayload {
  id: number;
  username: string;
  role: Role; // hoặc Role nếu bạn import enum Role từ Prisma
  phone: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;
    // Ép kiểu tại đây để gắn vào req
    (req as AuthenticatedRequest).user = decoded;
    // console.log((req as AuthenticatedRequest).user);
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
