import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { verifySuperAdmin } from "../middlewares/verifySuperAdmin ";
import {
  handleCreateNewUser,
  handleUserLogin,
  handlegetAllUsers,
} from "../controllers/CRUD_Controllers/CRUD_user";
const router = express.Router();

// Chỉ SUPER_ADMIN mới được tạo user
const createNewUserController = router.post(
  "/create-user",
  verifyToken,
  verifySuperAdmin,
  handleCreateNewUser
);

const loginUserController = router.post("/user-login", handleUserLogin);
const getAllUsersController = router.get(
  "/users",
  verifyToken,
  verifySuperAdmin,
  handlegetAllUsers
);

export { createNewUserController, loginUserController, getAllUsersController };
