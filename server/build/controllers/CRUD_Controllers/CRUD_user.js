"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteUserById = exports.handleUpdateUserById = exports.handleGetUserById = exports.handleGetAllUsers = exports.handleUserLogin = exports.handleCreateNewUser = void 0;
const zod_1 = require("zod");
const CRUD_user_service_1 = require("../../prisma/CRUD_Services/CRUD_user_service");
const schema_1 = require("../../middlewares/schema");
const handleCreateNewUser = async (req, res) => {
    try {
        const parsed = schema_1.userSchema.parse(req.body);
        const result = await (0, CRUD_user_service_1.createNewUser)(parsed.username, parsed.password, parsed.role, parsed.phone, parsed.email, parsed.fullname, parsed.birthday, parsed.branch);
        res.status(200).json(result);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            if (e instanceof zod_1.ZodError) {
                const errMessage = e._zod.def;
                const err = errMessage.map((e) => e.message);
                console.error("Lỗi trong controller handleCreateNewUser:", err.toString());
                res.status(500).json({
                    message: err.toString(),
                });
            }
        }
    }
};
exports.handleCreateNewUser = handleCreateNewUser;
const handleUserLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await (0, CRUD_user_service_1.userLogin)(username, password);
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Lỗi trong controller userLogin:", e);
        res.status(500).json({
            message: "Lỗi server khi đăng nhập",
        });
    }
};
exports.handleUserLogin = handleUserLogin;
const handleGetAllUsers = async (req, res) => {
    try {
        const result = await (0, CRUD_user_service_1.getAllUsers)();
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Lỗi trong controller handlegetAllUsers:", e);
        res.status(500).json({
            message: "Lỗi server khi lấy danh sách người dùng",
        });
    }
};
exports.handleGetAllUsers = handleGetAllUsers;
const handleGetUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await (0, CRUD_user_service_1.getUserById)(id);
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetUserById:", e);
        res.status(500).json({
            message: "Lỗi server khi lấy danh sách người dùng",
        });
    }
};
exports.handleGetUserById = handleGetUserById;
const handleUpdateUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { username, role, phone, email, fullname, birthday, branch } = req.body;
        const result = await (0, CRUD_user_service_1.updateUserById)(id, {
            username,
            role,
            phone,
            email,
            fullname,
            birthday,
            branch,
        });
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Lỗi trong controller handleUpdateUserById:", e);
        res.status(500).json({
            message: "Lỗi server khi cập nhật người dùng",
        });
    }
};
exports.handleUpdateUserById = handleUpdateUserById;
const handleDeleteUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const currentUserId = Number(req.body);
        const result = await (0, CRUD_user_service_1.deleteUserById)(id, currentUserId);
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Lỗi trong controller handleDeleteUserById:", e);
        res.status(500).json({
            message: "Lỗi server khi xóa người dùng",
        });
    }
};
exports.handleDeleteUserById = handleDeleteUserById;
