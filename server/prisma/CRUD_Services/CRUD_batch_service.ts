import { PrismaClient } from "@prisma/client";
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
        createdBy: {
          select: {
            username: true,
            phone: true,
            branch: true,
          },
        },
        batchSteps: true,
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
): Promise<{ message: string; data: any }> => {
  try {
    const data = await prisma.batch.findUnique({
      where: { id },
      include: {
        batchIngredients: {
          include: { ingredient: true },
        },
        recipe: {
          include: {
            recipeIngredients: {
              include: { ingredient: true },
            },
            steps: true,
          },
        },
        createdBy: {
          select: {
            username: true,
            phone: true,
            branch: true,
          },
        },
        batchSteps: true,
      },
    });

    if (!data) {
      return { message: "Chưa có mẻ nào được tạo", data: [] };
    }

    const batchIngredients = data.batchIngredients.map((bi) => ({
      ...bi,
      ingredient: {
        id: bi.ingredientId,
        name: bi.ingredient
          ? `${bi.ingredient.name}${
              bi.ingredient.isDeleted ? " (đã bị xóa)" : ""
            }`
          : "Nguyên liệu không xác định",
        type: bi.ingredient?.type ?? null,
        unit: bi.ingredient?.unit ?? "Không rõ",
      },
    }));

    const recipe = {
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
        volume: data.volume,
        recipeId: data.recipeId,
        createdById: data.createdById,
        createdBy: data.createdBy,
        recipeName: recipe.name,
        createdAt: data.createdAt,
        batchIngredients,
        recipe,
        batchSteps: data.batchSteps,
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mẻ nấu:", error);
    throw new Error("Lỗi server khi truy xuất mẻ nấu");
  }
};

export interface BatchSteps {
  batchId: number;
  recipeStepId: number;
  stepOrder: number;
  startedAt: string;
  scheduledEndAt: string;
}

const createBatch = async (
  beerName: string,
  volume: number,
  notes: string,
  recipeId: number,
  createdById: number,
  batchSteps: BatchSteps[]
): Promise<{ message: string; data: any }> => {
  try {
    const vnNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    const datePrefix = format(vnNow, "ddMMyy");

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
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      return { message: "Không có công thức đã chọn", data: [] };
    }

    const activeIngredients = recipe.recipeIngredients.filter(
      (ri) => ri.ingredient && !ri.ingredient.isDeleted
    );

    if (activeIngredients.length === 0) {
      return { message: "Cần bổ sung nguyên liệu cho công thức", data: [] };
    }

    const defaultVolume = 60;
    const scaleRatio = volume / defaultVolume;
    const insufficientIngredients: string[] = [];

    for (const ri of activeIngredients) {
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

    // 2. Tiến hành transaction
    const result = await prisma.$transaction(async (tx) => {
      // a. Trừ nguyên liệu
      for (const ri of activeIngredients) {
        const amountToUse = ri.amountNeeded * scaleRatio;
        await tx.ingredient.update({
          where: {
            id: ri.ingredientId,
            isDeleted: false,
          },
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
          volume,
          notes: notes || null,
          recipeId,
          createdById,
        },
      });

      await tx.batchStep.createMany({
        data: batchSteps.map((bt) => ({
          batchId: newBatch.id,
          recipeStepId: bt.recipeStepId,
          stepOrder: bt.stepOrder,
          startedAt: bt.startedAt,
          scheduledEndAt: bt.scheduledEndAt,
        })),
      });

      // c. Ghi lại batchIngredient
      for (const ri of activeIngredients) {
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

    const fullBatch = await prisma.batch.findUnique({
      where: { id: result.id },
      include: {
        batchIngredients: {
          include: {
            ingredient: true,
          },
        },
        createdBy: true,
        batchSteps: true,
      },
    });

    return {
      message: "Thêm mẻ thành công",
      data: fullBatch,
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
    status?: string;
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
        batchSteps: true,
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
      createdBy: {
        select: {
          username: true,
          phone: true,
          branch: true,
        },
      },
      batchSteps: true,
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
