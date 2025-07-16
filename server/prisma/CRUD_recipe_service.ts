import { PrismaClient } from "@prisma/client";
import { format } from "date-fns-tz";
import { paginate } from "./pagination";
const prisma = new PrismaClient();

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
    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        description: description || null,
        note: note || null,
        instructions: instructions || null,
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
  updateData: {
    name?: string;
    description?: string;
    note?: string;
    instructions?: string;
  }
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.recipe.findUnique({
      where: { id },
    });
    if (!existing) {
      return { message: "Không tim thấy công thức", data: [] };
    }
    const updated = await prisma.recipe.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
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
