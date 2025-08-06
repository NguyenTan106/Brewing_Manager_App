"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// log activity
const logActivity = async (action, entity, entityId, description, userId) => {
    try {
        await prisma.activityLog.create({
            data: {
                action,
                entity,
                entityId,
                description,
                userId,
            },
        });
    }
    catch (e) {
        console.error("Lỗi khi ghi log hoạt động:", e);
    }
};
exports.logActivity = logActivity;
