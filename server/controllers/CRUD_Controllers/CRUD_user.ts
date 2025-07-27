import { Request, Response } from "express";
import {
  createNewUser,
  userLogin,
  getAllUsers,
} from "../../prisma/CRUD_Services/CRUD_user_service";
import { userSchema } from "../../middlewares/schema";

const handleCreateNewUser = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.parse(req.body);
    const result = await createNewUser(
      parsed.username,
      parsed.password,
      parsed.role,
      parsed.phone,
      parsed.branch
    );
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleCreateNewUser:", e);
    res.status(500).json({
      message: "Lỗi server khi thêm người dùng mới",
    });
  }
};

const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await userLogin(username, password);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller userLogin:", e);
    res.status(500).json({
      message: "Lỗi server khi đăng nhập",
    });
  }
};

const handlegetAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await getAllUsers();
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handlegetAllUsers:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách người dùng",
    });
  }
};

export { handleCreateNewUser, handleUserLogin, handlegetAllUsers };
