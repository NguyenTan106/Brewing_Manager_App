import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getTotalRecipes = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const total = await prisma.recipe.count({
      where: { isDeleted: false },
    });

    if (total === 0) {
      return { message: "Chưa có công thức nào được tạo", data: 0 };
    }
    return {
      message: "Thành công",
      data: total,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức:", error);
    throw new Error("Lỗi server khi tính tổng công thức");
  }
};

const getTotalRecipesMostUsed = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.batch.groupBy({
      by: ["recipeId"],
      _count: {
        recipeId: true,
      },
      orderBy: {
        _count: {
          recipeId: "desc",
        },
      },
      take: 5,
    });

    const recipes = await Promise.all(
      data.map(async (item) => {
        const recipe = await prisma.recipe.findUnique({
          where: { id: item.recipeId!, isDeleted: false },
        });
        return {
          recipe,
          usedCount: item._count.recipeId,
        };
      })
    );

    return {
      message: "Top 5 công thức được dùng nhiều nhất",
      data: recipes,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức:", error);
    throw new Error("Lỗi server khi tính tổng công thức");
  }
};

const getTotalRecipesRecentlyUpdated = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      where: {
        isDeleted: false,
      },
    });

    return {
      message: "Top 5 công thức được cập nhật gần đây",
      data: recipes,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức:", error);
    throw new Error("Lỗi server khi lấy công thức cập nhật gần đây");
  }
};

export {
  getTotalRecipes,
  getTotalRecipesMostUsed,
  getTotalRecipesRecentlyUpdated,
};
