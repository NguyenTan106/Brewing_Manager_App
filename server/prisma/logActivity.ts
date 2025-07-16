import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// log activity
export const logActivity = async (
  action: string,
  entity: string,
  entityId: number,
  description: string,
  userId?: number
) => {
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
  } catch (e) {
    console.error("Lỗi khi ghi log hoạt động:", e);
  }
};
