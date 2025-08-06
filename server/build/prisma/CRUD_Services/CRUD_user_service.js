"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.getAllUsers = exports.userLogin = exports.createNewUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET=super_secret_2025_brewing_token!@#$";
if (!JWT_SECRET)
    throw new Error("Thiếu JWT_SECRET trong .env");
const createNewUser = async (username, password, role, phone, email, fullname, birthday, branch) => {
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
                phone,
                email,
                fullname,
                birthday,
                branch: role === "ADMIN" ? branch : null,
            },
        });
        return {
            message: "Thêm người dùng thành công",
            data: newUser,
        };
    }
    catch (e) {
        console.error("Lỗi khi tạo người dùng mới:", e);
        throw new Error("Không thể thêm người dùng mới");
    }
};
exports.createNewUser = createNewUser;
const userLogin = async (username, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username, isDeleted: false },
        });
        if (!user) {
            return { message: "Tài khoản không tồn tại", token: "", data: null };
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return { message: "Mật khẩu không đúng", token: "", data: null };
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            username: user.username,
            role: user.role,
            phone: user.phone,
        }, JWT_SECRET, { expiresIn: "7d" });
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
    }
    catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        throw new Error("Lỗi server khi đăng nhập");
    }
};
exports.userLogin = userLogin;
const getAllUsers = async () => {
    try {
        const data = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            where: { isDeleted: false },
            select: {
                id: true,
                username: true,
                role: true,
                phone: true,
                email: true,
                fullname: true,
                birthday: true,
                branch: true,
                createdAt: true,
                updatedAt: true,
                Batch: true,
            },
        });
        const dataWithBatchCount = data.map((user) => ({
            ...user,
            totalBatch: user.Batch.length,
        }));
        if (data.length === 0) {
            return { message: "Chưa có người dùng nào được", data: [] };
        }
        return {
            message: "Thành công",
            data: dataWithBatchCount,
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng :", error);
        throw new Error("Lỗi server khi truy suất người dùng");
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    try {
        const data = await prisma.user.findFirst({
            where: { id, isDeleted: false },
            select: {
                id: true,
                username: true,
                role: true,
                phone: true,
                email: true,
                fullname: true,
                birthday: true,
                branch: true,
                createdAt: true,
                updatedAt: true,
                Batch: true,
            },
        });
        if (!data) {
            return { message: "Không tìm thấy người dùng", data: [] };
        }
        return {
            message: "Thành công",
            data: { ...data, totalBatch: data.Batch.length },
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy người dùng:", error);
        throw new Error("Lỗi server khi truy suất người dùng");
    }
};
exports.getUserById = getUserById;
const updateUserById = async (id, updateData) => {
    try {
        const data = await prisma.user.update({
            where: { id, isDeleted: false },
            data: updateData,
        });
        if (!data) {
            return { message: "Không tìm thấy người dùng", data: [] };
        }
        return {
            message: "Thành công",
            data: data,
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy người dùng:", error);
        throw new Error("Lỗi server khi cập nhật người dùng");
    }
};
exports.updateUserById = updateUserById;
const deleteUserById = async (id, // id của người bị xóa
currentUserId // id của người đang thực hiện thao tác
) => {
    try {
        // Lấy thông tin người dùng trước
        const userToDelete = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                role: true,
                isDeleted: true,
            },
        });
        if (!userToDelete || userToDelete.isDeleted) {
            return { message: "Không tìm thấy người dùng", data: [] };
        }
        // ✅ Không cho xóa Super Admin
        if (userToDelete.role === "SUPER_ADMIN") {
            return { message: "Không thể xóa Super Admin", data: [] };
        }
        // ✅ Không cho xóa chính mình
        if (id === currentUserId) {
            return { message: "Không thể tự xóa chính mình", data: [] };
        }
        // ✅ Tiến hành cập nhật trạng thái isDeleted
        const data = await prisma.user.update({
            where: { id },
            data: { isDeleted: true },
        });
        return {
            message: "Thành công",
            data,
        };
    }
    catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        throw new Error("Lỗi server khi xóa người dùng");
    }
};
exports.deleteUserById = deleteUserById;
