"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogById = exports.getActivityLogPage = exports.getAllActivityLogs = void 0;
const client_1 = require("@prisma/client");
const pagination_1 = require("../pagination");
const prisma = new client_1.PrismaClient();
// CRUD activity log
const getAllActivityLogs = async () => {
    try {
        const data = await prisma.activityLog.findMany({
            orderBy: { timestamp: "desc" },
        });
        if (data.length === 0) {
            return { message: "Chưa có hoạt động nào được tạo", data: [] };
        }
        return {
            message: "Thành công",
            data: data,
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy danh nhật kí hoạt động:", error);
        throw new Error("Lỗi server khi truy xuất nhật kí hoạt động");
    }
};
exports.getAllActivityLogs = getAllActivityLogs;
const getActivityLogById = async (id) => {
    try {
        const data = await prisma.activityLog.findUnique({
            where: { id: id },
        });
        if (!data) {
            return { message: "Chưa có hoạt động nào được tạo", data: [] };
        }
        return {
            message: "Thành công",
            data: data,
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy danh nhật kí hoạt động:", error);
        throw new Error("Lỗi server khi truy xuất nhật kí hoạt động");
    }
};
exports.getActivityLogById = getActivityLogById;
const getActivityLogPage = async (page, limit) => {
    return (0, pagination_1.paginate)({
        page,
        limit,
        model: "activityLog",
        orderBy: { timestamp: "desc" },
        enhanceItem: async (i) => ({
            ...i,
        }),
    });
};
exports.getActivityLogPage = getActivityLogPage;
