import { PrismaClient, Role, User } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
if (!JWT_SECRET) throw new Error("Thiếu JWT_SECRET trong .env");
const createNewUser = async (
  username: string,
  password: string,
  role: Role,
  phone: string,
  branch?: string
): Promise<{ message: string; data: any }> => {
  try {
    // ✅ Kiểm tra trùng tên
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return {
        message: `${username.toUpperCase()} đã tồn tại`,
        data: null,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        phone,
        branch: role === "ADMIN" ? branch : null,
      },
    });

    return {
      message: "Thêm người dùng thành công",
      data: newUser,
    };
  } catch (e) {
    console.error("Lỗi khi tạo người dùng mới:", e);
    throw new Error("Không thể thêm người dùng mới");
  }
};

interface UserData {
  id: number;
  username: string;
  role: Role;
  phone: string | null;
}

interface LoginResult {
  message: string;
  token: string;
  data: UserData | null;
}

const userLogin = async (
  username: string,
  password: string
): Promise<LoginResult> => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return { message: "Tài khoản không tồn tại", token: "", data: null };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { message: "Mật khẩu không đúng", token: "", data: null };
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        phone: user.phone,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      message: "Đăng nhập thành công",
      token: token,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        phone: user.phone,
      },
    };
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    throw new Error("Lỗi server khi đăng nhập");
  }
};

const getAllUsers = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      where: { isDeleted: false },
    });

    if (data.length === 0) {
      return { message: "Chưa có người dùng nào được", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng :", error);
    throw new Error("Lỗi server khi truy suất người dùng");
  }
};

export { createNewUser, userLogin, getAllUsers };
