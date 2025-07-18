import { PrismaClient, Status } from "@prisma/client";
import { format } from "date-fns-tz";
import { paginate } from "./pagination";
const prisma = new PrismaClient();

// CRUD batchs
const getAllBatches = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.batch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        batchIngredients: {
          include: {
            ingredient: true,
          },
        },
        recipe: {
          include: {
            recipeIngredients: {
              include: { ingredient: true },
            },
          },
        }, // nếu muốn lấy luôn thông tin công thức liên kết
      },
    });
    if (data.length === 0) {
      return { message: "Chưa có mẻ nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mẻ nấu:", error);
    throw new Error("Lỗi server khi truy xuất mẻ nấu");
  }
};

const getBatchById = async (
  id: number
): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.batch.findUnique({
      where: { id },
      include: {
        batchIngredients: {
          include: {
            ingredient: true,
          },
        },
        recipe: {
          include: {
            recipeIngredients: {
              include: { ingredient: true },
            },
          },
        }, // nếu muốn lấy luôn thông tin công thức liên kết
      },
    });
    if (!data) {
      return { message: "Chưa có mẻ nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mẻ nấu:", error);
    throw new Error("Lỗi server khi truy xuất mẻ nấu");
  }
};

const createBatch = async (
  beerName: string,
  status: Status,
  volume: number,
  notes: string,
  recipeId: number
): Promise<{ message: string; data: any }> => {
  try {
    const vnNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    const datePrefix = format(vnNow, "ddMMyy"); // ví dụ: 160725

    // Lấy các batch đã tạo hôm nay
    const todayStart = new Date(vnNow);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(vnNow);
    todayEnd.setHours(23, 59, 59, 999);

    const todayBatches = await prisma.batch.findMany({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const countToday = todayBatches.length + 1;
    const serial = String(countToday).padStart(2, "0"); // NN: 01, 02, ...
    const newCode = `B${datePrefix}${serial}`; // B16072501

    // Giờ tạo batch mới
    const newBatch = await prisma.batch.create({
      data: {
        code: newCode,
        beerName: beerName,
        status: status,
        volume: Number(volume),
        notes: notes || null,
        recipeId: Number(recipeId) || null,
      },
    });

    return {
      message: "Thêm mẻ thành công",
      data: newBatch,
    };
  } catch (e) {
    console.error("Lỗi khi tạo mẻ mới:", e);
    throw new Error("Không thể thêm mẻ mới");
  }
};

const updateBatchById = async (
  id: number,
  updateData: {
    beerName?: string;
    status?: Status;
    volume?: number;
    notes?: string;
    recipeId?: number | null;
  }
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.batch.findUnique({
      where: { id },
    });
    if (!existing) {
      return { message: "Không tim thấy mẻ", data: [] };
    }
    const updated = await prisma.batch.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
    });

    return {
      message: "Cập nhật nguyên liệu thành công",
      data: updated,
    };
  } catch (e) {
    console.error("Lỗi khi cập nhật mẻ:", e);
    throw new Error("Không thể cập nhật mẻ");
  }
};

const deleteBacthById = async (
  id: number
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.batch.findUnique({
      where: { id },
    });
    if (!existing) {
      return { message: "Không tim thấy mẻ", data: [] };
    }
    const deleted = await prisma.batch.delete({
      where: { id },
    });
    return {
      message: "Xóa mẻ thành công",
      data: deleted,
    };
  } catch (e) {
    console.error("Lỗi khi xóa mẻ:", e);
    throw new Error("Không thể xóa mẻ");
  }
};

const getBatchPage = async (page: number, limit: number) => {
  return paginate({
    page,
    limit,
    model: "batch",
    orderBy: { id: "asc" },
    enhanceItem: async (i) => ({
      ...i,
    }),
  });
};

// const create = async () => {
//   await prisma.batch.create({
//     data: {
//       code: "B001",
//       beerName: "IPA",
//       status: "boiling",
//       volume: 50,
//     },
//   });
// };

// create();
export {
  getAllBatches,
  getBatchById,
  createBatch,
  deleteBacthById,
  updateBatchById,
  getBatchPage,
};
