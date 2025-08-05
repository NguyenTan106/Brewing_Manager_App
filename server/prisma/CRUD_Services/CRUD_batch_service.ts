import { PrismaClient } from "@prisma/client";
import { paginate } from "../pagination";
import { format } from "date-fns-tz";
import { getIngredientStatus } from "./CRUD_ingredient_service";

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
    const result = validate.map((batch, index) => ({
      ...batch,
      status: getBatchStatus(batch.batchSteps, batch.isCancelled ?? false),
    }));
    return {
      message: "Thành công",
      data: result,
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

    const status = getBatchStatus(data.batchSteps, data.isCancelled ?? false);
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
        isCancelled: data.isCancelled,
        recipeName: recipe.name,
        createdAt: data.createdAt,
        batchIngredients,
        recipe,
        batchSteps: data.batchSteps,
        status,
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
  startedAt: string | Date | null;
  scheduledEndAt: string | Date | null;
}

const getBatchStepById = async (id: number) => {
  try {
    const batchStep = await prisma.batchStep.findUnique({
      where: { id },
    });
    if (!batchStep) {
      return { message: "Chưa có bước nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: batchStep,
    };
  } catch (e) {
    console.error("Lỗi khi lấy danh sách cách bước nấu:", e);
    throw new Error("Lỗi server khi truy xuất các bước nấu");
  }
};

// getBatchStepById(1)
//   .then(() => console.log("Thành công"))
//   .catch(() => console.log("Thất bại"));

export const getBatchStatus = (
  batchSteps: BatchSteps[],
  isCancelled: boolean
): string => {
  if (isCancelled) return "Đã hủy";

  const now = new Date();
  const sortedSteps = [...batchSteps].sort((a, b) => a.stepOrder - b.stepOrder);

  for (const step of sortedSteps) {
    const start = step.startedAt ? new Date(step.startedAt) : null;
    const end = step.scheduledEndAt ? new Date(step.scheduledEndAt) : null;

    if (start && now < start) {
      return `Sắp tới: Bước ${step.stepOrder}`;
    }

    if (start && end && now >= start && now <= end) {
      return `Đang thực hiện: Bước ${step.stepOrder}`;
    }
  }

  const allStarted = sortedSteps.every((step) => !!step.startedAt);
  if (allStarted) return "Đã hoàn thành";

  const noneStarted = sortedSteps.every((step) => !step.startedAt);
  if (noneStarted) return "Chưa bắt đầu";

  return "Đang chờ bước tiếp theo";
};

const createBatch = async (
  beerName: string,
  volume: number,
  notes: string,
  recipeId: number,
  createdById: number
): Promise<{ message: string; data: any }> => {
  try {
    // 1. Tạo mã tự động
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

    const defaultVolume = 60;
    const scaleRatio = volume / defaultVolume;
    const insufficientIngredients: string[] = [];

    const activeIngredients = recipe.recipeIngredients.filter(
      (ri) => ri.ingredient && !ri.ingredient.isDeleted
    );

    if (activeIngredients.length === 0) {
      return { message: "Cần bổ sung nguyên liệu cho công thức", data: [] };
    }

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

      const recipeSteps = await tx.recipeStep.findMany({
        where: { recipeId },
        orderBy: { stepOrder: "asc" },
      });

      const now = new Date();
      let currentStartTime = new Date(now); // thời gian bắt đầu bước đầu tiên

      const batchSteps = recipeSteps.map((step) => {
        const startedAt = new Date(currentStartTime); // copy thời gian bắt đầu
        const scheduledEndAt = new Date(
          startedAt.getTime() + step.durationMinutes * 60 * 1000
        );

        // chuẩn bị dữ liệu để tạo
        const batchStepData = {
          batchId: newBatch.id,
          recipeStepId: step.id,
          stepOrder: step.stepOrder,
          name: step.name,
          startedAt,
          scheduledEndAt,
        };

        currentStartTime = scheduledEndAt; // cập nhật cho bước tiếp theo
        return batchStepData;
      });

      await tx.batchStep.createMany({
        data: batchSteps,
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
        recipe: true,
        createdBy: true,
        batchSteps: true,
      },
    });

    if (!fullBatch) {
      return {
        message: "Thêm mẻ thất bại",
        data: null,
      };
    }

    const batchStatus = getBatchStatus(
      fullBatch.batchSteps,
      fullBatch.isCancelled ?? false
    );

    // ✅ Thêm cost và status trực tiếp vào mỗi ingredient
    for (const bi of fullBatch.batchIngredients) {
      const latestCost = await prisma.ingredientCostHistory.findFirst({
        where: { ingredientId: bi.ingredientId },
        orderBy: { createdAt: "desc" },
        select: { cost: true },
      });

      // @ts-ignore
      bi.ingredient.cost = latestCost?.cost ?? 0;
      // @ts-ignore
      bi.ingredient.status = await getIngredientStatus(
        bi.ingredient.quantity,
        bi.ingredient.lowStockThreshold
      );
    }

    return {
      message: "Thêm mẻ thành công",
      data: { ...fullBatch, status: batchStatus },
    };
  } catch (e) {
    console.error("Lỗi khi tạo mẻ mới:", e);
    throw new Error("Không thể thêm mẻ mới");
  }
};

export const updateFeedbackBatchStep = async (
  id: number,
  updateData: {
    feedback: string;
    actualDuration: string;
  }
) => {
  try {
    const existing = await prisma.batch.findUnique({
      where: { id },
    });
    if (!existing) {
      return { message: "Không tim thấy mẻ", data: [] };
    }
    // console.log("Dữ liệu cập nhật batchStep:", updateData);
    const updateBatchStep = await prisma.batchStep.update({
      where: { id },
      data: updateData,
    });

    return {
      message: "Cập nhật feedback thành công",
      data: updateBatchStep,
    };
  } catch (e) {
    console.error("Lỗi khi cập nhật mẻ:", e);
    throw new Error("Không thể cập nhật mẻ");
  }
};

// updateFeedbackBatchSteps(1, [
//   {
//     batchStepId: 1,
//     feedback: "Bước này diễn ra suôn sẻ.",
//     actualDuration: "00:12:30",
//   },
//   {
//     batchStepId: 2,
//     feedback: "Cần kiểm tra nhiệt độ thường xuyên.",
//     actualDuration: "00:08:45",
//   },
//   {
//     batchStepId: 3,
//     feedback: "Hơi chậm do máy bơm yếu.",
//     actualDuration: "00:15:10",
//   },
// ]).then((result) => console.log(result));

const updateBatchById = async (
  id: number,
  updateData: {
    beerName?: string;
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

const cancelBatchById = async (
  id: number
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.batch.findUnique({
      where: { id },
    });

    if (!existing) {
      return { message: "Không tìm thấy mẻ", data: null };
    }

    if (existing.isCancelled) {
      return { message: "Mẻ đã bị hủy trước đó", data: existing };
    }

    const canceled = await prisma.batch.update({
      where: { id },
      data: {
        isCancelled: true,
      },
    });

    return {
      message: "Hủy mẻ thành công",
      data: canceled,
    };
  } catch (e) {
    console.error("Lỗi khi hủy mẻ:", e);
    return {
      message: "Đã xảy ra lỗi khi hủy mẻ",
      data: null,
    };
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
    enhanceItem: async (batch) => {
      const status = getBatchStatus(batch.batchSteps, batch.isCancelled);

      return {
        ...batch,
        recipe: {
          ...batch.recipe,
          name: batch.recipe?.isDeleted
            ? `${batch.recipe.name} (đã bị xóa)`
            : batch.recipe?.name,
        },
        status: status,
      };
    },
  });
};

export {
  getAllBatches,
  getBatchById,
  createBatch,
  deleteBacthById,
  updateBatchById,
  getBatchPage,
  getBatchStepById,
  cancelBatchById,
};
