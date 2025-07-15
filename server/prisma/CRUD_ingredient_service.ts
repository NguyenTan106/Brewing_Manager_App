import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

const getIngredientStatus = async (
  quantity: number,
  threshold: number
): Promise<string> => {
  if (quantity <= 0) return "Hết";
  if (quantity <= threshold) return "Sắp hết";
  return "Đủ";
};

// CRUD ingredient
const getAllIngredients = async (): Promise<{ message: string; data: any }> => {
  try {
    const data = await prisma.ingredient.findMany({
      orderBy: {
        id: "asc", // hoặc "desc" cho giảm dần
      },
    });
    if (data.length === 0) {
      return { message: "Chưa có nguyên liệu nào", data: [] };
    }
    const result = await Promise.all(
      data.map(async (i) => ({
        ...i,
        status: await getIngredientStatus(i.quantity, i.lowStockThreshold),
      }))
    );
    return {
      message: "Thành công",
      data: result,
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
      return { message: "Không tìm thấy nguyên liệu", data: [] };
    }
    const result = {
      ...data,
      status: await getIngredientStatus(data.quantity, data.lowStockThreshold),
    };
    return {
      message: "Thành công",
      data: result,
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

// log activity
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

// CRUD type
const getAllTypes = async (): Promise<{ message: string; data: any }> => {
  try {
    const data = await prisma.type.findMany();
    if (data.length === 0) {
      return { message: "Chưa có loại nào", data: [] };
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

const createType = async (
  typeName: string
): Promise<{ message: string; data: any }> => {
  try {
    // ✅ Kiểm tra trùng tên
    const existing = await prisma.type.findUnique({
      where: {
        typeName: typeName, // shorthand, tương đương typeName: typeName
      },
    });

    if (existing) {
      return {
        message: `Loại nguyên liệu ${typeName} đã tồn tại`,
        data: null,
      };
    }

    // ✅ Tạo nguyên liệu mới nếu không trùng
    const data = await prisma.type.create({
      data: {
        typeName,
      },
    });

    return {
      message: "Thêm loại nguyên liệu thành công",
      data,
    };
  } catch (e) {
    console.error("Lỗi khi tạo loại nguyên liệu:", e);
    throw new Error("Không thể thêm loai nguyên liệu");
  }
};

const deleteType = async (
  id: number
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.type.findUnique({ where: { id: id } });
    if (!existing) {
      return {
        message: `Không tìm thấy loại nguyên liệu với ID = ${id}`,
        data: null,
      };
    }

    const deleted = await prisma.type.delete({
      where: { id },
    });

    return {
      message: "Xóa loại nguyên liệu thành công",
      data: deleted,
    };
  } catch (e) {
    console.error("Lỗi khi xóa loại nguyên liệu:", e);
    throw new Error("Không thể xóa loại nguyên liệu");
  }
};

const pagination = async (page: number, limit: number) => {
  try {
    const skip = (page - 1) * limit;

    // Lấy tổng số lượng bản ghi
    const total = await prisma.ingredient.count();

    // Lấy danh sách bản ghi theo trang
    const ingredients = await prisma.ingredient.findMany({
      skip,
      take: limit,
      orderBy: {
        id: "asc",
      },
    });

    const result = await Promise.all(
      ingredients.map(async (i) => ({
        ...i,
        status: await getIngredientStatus(i.quantity, i.lowStockThreshold),
      }))
    );

    return {
      data: result,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  } catch (error) {
    console.error("Phân trang lỗi:", error);
  }
};

export {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredientById,
  deleteIngredientById,
  logActivity,
  getAllTypes,
  createType,
  deleteType,
  pagination,
};
