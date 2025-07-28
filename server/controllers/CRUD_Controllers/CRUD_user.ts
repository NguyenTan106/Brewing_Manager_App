import { Request, Response } from "express";
import {
  createNewUser,
  userLogin,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
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

const handleGetAllUsers = async (req: Request, res: Response) => {
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

const handleGetUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await getUserById(id);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleGetUserById:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách người dùng",
    });
  }
};

const handleUpdateUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { username, role, phone, branch } = req.body;
    const result = await updateUserById(id, { username, role, phone, branch });
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleUpdateUserById:", e);
    res.status(500).json({
      message: "Lỗi server khi cập nhật người dùng",
    });
  }
};

const handleDeleteUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const currentUserId = Number(req.body);
    const result = await deleteUserById(id, currentUserId);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleDeleteUserById:", e);
    res.status(500).json({
      message: "Lỗi server khi xóa người dùng",
    });
  }
};

export {
  handleCreateNewUser,
  handleUserLogin,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
};
