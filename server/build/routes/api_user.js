"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByIdController = exports.updateUserByIdController = exports.getUserByIdController = exports.getAllUsersController = exports.loginUserController = exports.createNewUserController = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const verifySuperAdmin_1 = require("../middlewares/verifySuperAdmin ");
const CRUD_user_1 = require("../controllers/CRUD_Controllers/CRUD_user");
const router = express_1.default.Router();
// Chỉ SUPER_ADMIN mới được tạo user
const createNewUserController = router.post("/create-user", verifyToken_1.verifyToken, verifySuperAdmin_1.verifySuperAdmin, CRUD_user_1.handleCreateNewUser);
exports.createNewUserController = createNewUserController;
const loginUserController = router.post("/user-login", CRUD_user_1.handleUserLogin);
exports.loginUserController = loginUserController;
const getAllUsersController = router.get("/users", verifyToken_1.verifyToken, verifySuperAdmin_1.verifySuperAdmin, CRUD_user_1.handleGetAllUsers);
exports.getAllUsersController = getAllUsersController;
const getUserByIdController = router.get("/user/:id", verifyToken_1.verifyToken, verifySuperAdmin_1.verifySuperAdmin, CRUD_user_1.handleGetUserById);
exports.getUserByIdController = getUserByIdController;
const updateUserByIdController = router.put("/update-user/:id", verifyToken_1.verifyToken, verifySuperAdmin_1.verifySuperAdmin, CRUD_user_1.handleUpdateUserById);
exports.updateUserByIdController = updateUserByIdController;
const deleteUserByIdController = router.delete("/delete-user/:id", verifyToken_1.verifyToken, verifySuperAdmin_1.verifySuperAdmin, CRUD_user_1.handleDeleteUserById);
exports.deleteUserByIdController = deleteUserByIdController;
