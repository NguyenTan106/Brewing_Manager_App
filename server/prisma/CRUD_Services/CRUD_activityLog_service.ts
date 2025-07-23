import { PrismaClient } from "@prisma/client";

import { format } from "date-fns-tz";
import { paginate } from "../pagination";
const prisma = new PrismaClient();

// CRUD activity log
const getAllActivityLogs = async (): Promise<{
  message: string;
  data: any;
}> => {
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
  } catch (error) {
    console.error("Lỗi khi lấy danh nhật kí hoạt động:", error);
    throw new Error("Lỗi server khi truy xuất nhật kí hoạt động");
  }
};

const getActivityLogById = async (
  id: number
): Promise<{
  message: string;
  data: any;
}> => {
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
  } catch (error) {
    console.error("Lỗi khi lấy danh nhật kí hoạt động:", error);
    throw new Error("Lỗi server khi truy xuất nhật kí hoạt động");
  }
};

const getActivityLogPage = async (page: number, limit: number) => {
  return paginate({
    page,
    limit,
    model: "activityLog",
    orderBy: { timestamp: "desc" },
    enhanceItem: async (i) => ({
      ...i,
    }),
  });
};

export { getAllActivityLogs, getActivityLogPage, getActivityLogById };
