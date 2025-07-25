import { PrismaClient, Status } from "@prisma/client";
import { format } from "date-fns-tz";
import { paginate } from "../pagination";

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
    const validate = data.map((e) => ({
      ...e,
      recipe: {
        ...e.recipe,
        name: e.recipe?.isDeleted
          ? `${e.recipe.name} (đã bị xóa)`
          : e.recipe?.name,
      },
    }));
    if (validate.length === 0) {
      return { message: "Chưa có mẻ nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: validate,
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
    // Xử lý để hiển thị rõ nguyên liệu đã bị xóa
    const batchIngredientList = data.batchIngredients.map((bi) => ({
      id: bi.id,
      batchId: bi.batchId,
      ingredientId: bi.ingredientId,
      amountUsed: bi.amountUsed,
      ingredient: {
        id: bi.ingredientId,
        name: bi.ingredient
          ? bi.ingredient.isDeleted
            ? `${bi.ingredient.name} (đã bị xóa)`
            : bi.ingredient.name
          : "Nguyên liệu không xác định",
        type: bi.ingredient.type,
        unit: bi.ingredient?.unit || "Không rõ",
      },
    }));

    const recipeIngredientList = {
      ...data.recipe,
      name: data.recipe?.isDeleted
        ? `${data.recipe.name} (đã bị xóa)`
        : data.recipe?.name,
    };

    return {
      message: "Thành công",
      data: {
        id: data.id,
        code: data.code,
        beerName: data.beerName,
        status: data.status,
        volume: data.volume,
        recipeId: data.recipeId,
        recipeName: data.recipe?.name,
        createdAt: data.createdAt,
        batchIngredients: batchIngredientList,
        recipe: recipeIngredientList,
      },
      // data: data,
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
    const datePrefix = format(vnNow, "ddMMyy"); // ví dụ: 230725

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
    });

    const countToday = todayBatches.length + 1;
    const serial = String(countToday).padStart(2, "0");
    const newCode = `B${datePrefix}${serial}`;

    // 1. Lấy công thức và nguyên liệu
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId, isDeleted: false },
      include: {
        recipeIngredients: {
          include: { ingredient: true },
        },
      },
    });

    const activeIngredients = recipe?.recipeIngredients.filter(
      (ri) => ri.ingredient && ri.ingredient.isDeleted === false
    );

    if (!recipe) return { message: "Không có công thức đã chọn", data: [] };

    if (activeIngredients?.length === 0)
      return { message: "Cần bổ sung nguyên liệu cho công thức", data: [] };

    const defaultVolume = 60; // Ví dụ: mỗi công thức chuẩn là 60 lít
    const scaleRatio = volume / defaultVolume;
    const insufficientIngredients: string[] = [];

    for (const ri of recipe.recipeIngredients) {
      const amountToUse = ri.amountNeeded * scaleRatio;
      if (ri.ingredient.quantity < amountToUse) {
        insufficientIngredients.push(ri.ingredient.name);
      }
    }

    if (insufficientIngredients.length > 0) {
      return {
        message: `Nguyên liệu không đủ: ${insufficientIngredients.join(", ")}`,
        data: [],
      };
    }

    // 2. Tiến hành transaction: trừ nguyên liệu + tạo batch + tạo batchIngredients
    const result = await prisma.$transaction(async (tx) => {
      // a. Trừ nguyên liệu
      for (const ri of recipe.recipeIngredients) {
        const amountToUse = ri.amountNeeded * scaleRatio;
        await tx.ingredient.update({
          where: { id: ri.ingredientId, isDeleted: false },
          data: {
            quantity: {
              decrement: amountToUse,
            },
          },
        });
      }

      // b. Tạo mẻ
      const newBatch = await tx.batch.create({
        data: {
          code: newCode,
          beerName,
          status,
          volume,
          notes: notes || null,
          recipeId,
        },
      });

      // c. Ghi lại batchIngredient
      for (const ri of recipe.recipeIngredients) {
        const amountToUse = ri.amountNeeded * scaleRatio;
        await tx.batchIngredient.create({
          data: {
            batchId: newBatch.id,
            ingredientId: ri.ingredientId,
            amountUsed: amountToUse,
          },
        });
      }

      return newBatch;
    });

    return {
      message: "Thêm mẻ thành công",
      data: result,
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
    notes?: string;
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
      data: updateData,
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
    orderBy: { id: "desc" },
    enhanceItem: async (i) => ({
      ...i,
      recipe: {
        ...i.recipe,
        name: i.recipe?.isDeleted
          ? `${i.recipe.name} (đã bị xóa)`
          : i.recipe?.name,
      },
    }),
  });
};

export {
  getAllBatches,
  getBatchById,
  createBatch,
  deleteBacthById,
  updateBatchById,
  getBatchPage,
};
