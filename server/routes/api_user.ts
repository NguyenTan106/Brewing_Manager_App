import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { verifySuperAdmin } from "../middlewares/verifySuperAdmin ";
import {
  handleCreateNewUser,
  handleUserLogin,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
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
  handleGetAllUsers
);

const getUserByIdController = router.get(
  "/user/:id",
  verifyToken,
  verifySuperAdmin,
  handleGetUserById
);

const updateUserByIdController = router.put(
  "/update-user/:id",
  verifyToken,
  verifySuperAdmin,
  handleUpdateUserById
);

const deleteUserByIdController = router.delete(
  "/delete-user/:id",
  verifyToken,
  verifySuperAdmin,
  handleDeleteUserById
);

export {
  createNewUserController,
  loginUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
};
