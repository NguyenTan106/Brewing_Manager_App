import { PrismaClient } from "@prisma/client";
import { format } from "date-fns-tz";
import { paginate } from "./pagination";
const prisma = new PrismaClient();

export type IngredientInput = {
  ingredientId: number;
  amountNeeded: number;
};

// CRUD recipe
const getAllRecipes = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.recipe.findMany({
      include: {
        recipeIngredients: {
          include: { ingredient: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    if (data.length === 0) {
      return { message: "Chưa có công thức nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức:", error);
    throw new Error("Lỗi server khi truy xuất công thức");
  }
};

const getRecipeById = async (
  id: number
): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.recipe.findUnique({
      where: { id },
      include: {
        recipeIngredients: {
          include: { ingredient: true },
        },
      },
    });
    if (!data) {
      return { message: "Chưa có công thức nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức:", error);
    throw new Error("Lỗi server khi truy xuất công thức");
  }
};

const createRecipe = async (
  name: string,
  recipeIngredients: IngredientInput[],
  description?: string,
  note?: string,
  instructions?: string
): Promise<{ message: string; data: any }> => {
  try {
    // ✅ Kiểm tra trùng tên
    const existing = await prisma.recipe.findUnique({
      where: { name: name },
    });

    if (existing) {
      return {
        message: `Công thức ${name} đã tồn tại`,
        data: null,
      };
    }

    if (
      !recipeIngredients ||
      !Array.isArray(recipeIngredients) ||
      recipeIngredients.length === 0
    ) {
      return {
        message: "Danh sách nguyên liệu không hợp lệ",
        data: null,
      };
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        description: description || null,
        note: note || null,
        instructions: instructions || null,
        recipeIngredients: {
          create: recipeIngredients.map((ing: any) => ({
            ingredientId: ing.ingredientId,
            amountNeeded: ing.amountNeeded,
          })),
        },
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true, // nếu muốn trả cả tên nguyên liệu
          },
        },
      },
    });

    return {
      message: "Thêm công thức thành công",
      data: newRecipe,
    };
  } catch (e) {
    console.error("Lỗi khi tạo công thức mới:", e);
    throw new Error("Không thể thêm công thức mới");
  }
};

const updateRecipeById = async (
  id: number,
  name?: string,
  description?: string,
  note?: string,
  instructions?: string,
  recipeIngredients?: IngredientInput[]
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.recipe.findUnique({
      where: { id },
      include: {
        recipeIngredients: true,
      },
    });

    if (!existing) {
      return { message: "Không tìm thấy công thức", data: [] };
    }

    // Nếu có truyền vào danh sách nguyên liệu mới
    if (recipeIngredients && Array.isArray(recipeIngredients)) {
      const currentIngredients = existing.recipeIngredients;
      const newIds = recipeIngredients.map((ri) => ri.ingredientId);

      // ✅ Xóa nguyên liệu không còn trong danh sách mới
      const toDelete = currentIngredients.filter(
        (ri) => !newIds.includes(ri.ingredientId)
      );

      for (const ri of toDelete) {
        await prisma.recipeIngredient.delete({
          where: { id: ri.id },
        });
      }

      // ✅ Thêm mới hoặc cập nhật nguyên liệu
      for (const newRI of recipeIngredients) {
        const existingRI = currentIngredients.find(
          (ri) => ri.ingredientId === newRI.ingredientId
        );

        if (existingRI) {
          if (existingRI.amountNeeded !== newRI.amountNeeded) {
            // ✅ Cập nhật số lượng nếu khác
            await prisma.recipeIngredient.update({
              where: { id: existingRI.id },
              data: {
                amountNeeded: Number(newRI.amountNeeded),
              },
            });
          }
        } else {
          // ✅ Thêm mới nếu chưa có
          await prisma.recipeIngredient.create({
            data: {
              recipeId: id,
              ingredientId: newRI.ingredientId,
              amountNeeded: Number(newRI.amountNeeded),
            },
          });
        }
      }
    }

    // ✅ Cập nhật thông tin chung của recipe
    const updated = await prisma.recipe.update({
      where: { id },
      data: {
        name,
        description,
        note,
        instructions,
        updatedAt: new Date(),
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return {
      message: "Cập nhật công thức thành công",
      data: updated,
    };
  } catch (e) {
    console.error("Lỗi khi cập nhật công thức:", e);
    throw new Error("Không thể cập nhật công thức");
  }
};

const deleteRecipeById = async (
  id: number
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.recipe.findUnique({
      where: { id },
    });
    if (!existing) {
      return { message: "Không tim thấy công thức", data: [] };
    }

    // ✅ Xóa các liên kết nguyên liệu trước
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });

    const deleted = await prisma.recipe.delete({
      where: { id },
    });
    return {
      message: "Xóa công thức thành công",
      data: deleted,
    };
  } catch (e) {
    console.error("Lỗi khi xóa công thức:", e);
    throw new Error("Không thể xóa công thức");
  }
};

export {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
};
