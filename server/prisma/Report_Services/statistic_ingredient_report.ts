import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getTotalIngredients = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const total = await prisma.ingredient.count();

    if (total === 0) {
      return { message: "Chưa có nguyên liệu nào được tạo", data: 0 };
    }
    return {
      message: "Thành công",
      data: total,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
    throw new Error("Lỗi server khi tính tổng nguyên liệu");
  }
};

const getIngredientStockStatus = async (): Promise<{
  message: string;
  data: {
    outOfStock: number;
    lowStock: number;
  };
}> => {
  try {
    const outOfStock = await prisma.ingredient.count({
      where: {
        quantity: 0,
      },
    });

    const lowStock = await prisma.ingredient.count({
      where: {
        quantity: {
          gt: 0,
          lte: prisma.ingredient.fields.lowStockThreshold,
        },
      },
    });

    return {
      message: "Thành công",
      data: {
        outOfStock,
        lowStock,
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy tình trạng kho nguyên liệu:", error);
    throw new Error("Lỗi server khi thống kê nguyên liệu sắp hết / đã hết");
  }
};

export { getTotalIngredients, getIngredientStockStatus };
