import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

const getAllIngredients = async (): Promise<{ message: string; data: any }> => {
  try {
    const data = await prisma.ingredient.findMany();
    if (data.length === 0) {
      return { message: "Chưa có nguyên liệu nào", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const getIngredientById = async (
  id: number
): Promise<{ message: string; data: any }> => {
  try {
    const data = await prisma.ingredient.findUnique({
      where: { id: id },
    });
    if (!data) {
      return { message: "Chưa có nguyên liệu nào", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const createIngredient = async (
  name: string,
  type: string,
  unit: string,
  quantity: number,
  lowStockThreshold: number,
  lastImportDate: Date,
  notes: string
): Promise<{ message: string; data: any }> => {
  try {
    // ✅ Kiểm tra trùng tên
    const existing = await prisma.ingredient.findUnique({
      where: { name: name },
    });

    if (existing) {
      return {
        message: `Nguyên liệu ${name} đã tồn tại`,
        data: null,
      };
    }

    // ✅ Tạo nguyên liệu mới nếu không trùng
    const data = await prisma.ingredient.create({
      data: {
        name,
        type,
        unit,
        quantity,
        lowStockThreshold,
        lastImportDate,
        notes,
      },
    });

    return {
      message: "Thêm nguyên liệu thành công",
      data,
    };
  } catch (e) {
    console.error("Lỗi khi tạo nguyên liệu:", e);
    throw new Error("Không thể thêm nguyên liệu");
  }
};

const updateIngredientById = async (
  id: number,
  updateData: {
    name?: string;
    type?: string;
    unit?: string;
    quantity?: number;
    lowStockThreshold?: number;
    lastImportDate?: Date;
    notes?: string;
  }
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.ingredient.findUnique({ where: { id } });

    if (!existing) {
      return {
        message: `Không tìm thấy nguyên liệu với ID = ${id}`,
        data: null,
      };
    }

    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(), // cập nhật thủ công nếu không dùng @updatedAt
      },
    });

    return {
      message: "Cập nhật nguyên liệu thành công",
      data: updated,
    };
  } catch (e) {
    console.error("Lỗi khi cập nhật nguyên liệu:", e);
    throw new Error("Không thể cập nhật nguyên liệu");
  }
};

const deleteIngredientById = async (
  id: number
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.ingredient.findUnique({ where: { id } });

    if (!existing) {
      return {
        message: `Không tìm thấy nguyên liệu với ID = ${id}`,
        data: null,
      };
    }

    const deleted = await prisma.ingredient.delete({
      where: { id },
    });

    return {
      message: "Xóa nguyên liệu thành công",
      data: deleted,
    };
  } catch (e) {
    console.error("Lỗi khi xóa nguyên liệu:", e);
    throw new Error("Không thể xóa nguyên liệu");
  }
};

const logActivity = async (
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

// createIngredient(
//   "Pale Ale Malt",
//   "malt",
//   "kg",
//   25,
//   10,
//   new Date("2025-07-08T00:00:00.000Z"),
//   "Malt cơ bản cho bia vàng nhạt"
// ).then(() => {
//   console.log(`successfully`);
// });

export {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredientById,
  deleteIngredientById,
  logActivity,
};
