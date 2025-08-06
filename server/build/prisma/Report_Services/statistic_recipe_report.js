"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop5RecipesRecentlyUpdated = exports.getTop5RecipesMostUsed = exports.getTotalRecipes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTotalRecipes = async () => {
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
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách công thức:", error);
        throw new Error("Lỗi server khi tính tổng công thức");
    }
};
exports.getTotalRecipes = getTotalRecipes;
const getTop5RecipesMostUsed = async () => {
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
        const recipes = await Promise.all(data.map(async (item) => {
            const recipe = await prisma.recipe.findFirst({
                where: { id: item.recipeId, isDeleted: false },
            });
            if (!recipe)
                return null; // bỏ qua nếu bị xóa
            return {
                recipe,
                usedCount: item._count.recipeId,
            };
        }));
        // lọc bỏ null và lấy top 5
        const filtered = recipes.filter(Boolean).slice(0, 5);
        return {
            message: "Top 5 công thức được dùng nhiều nhất",
            data: filtered,
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách công thức:", error);
        throw new Error("Lỗi server khi tính tổng công thức");
    }
};
exports.getTop5RecipesMostUsed = getTop5RecipesMostUsed;
const getTop5RecipesRecentlyUpdated = async () => {
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
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách công thức:", error);
        throw new Error("Lỗi server khi lấy công thức cập nhật gần đây");
    }
};
exports.getTop5RecipesRecentlyUpdated = getTop5RecipesRecentlyUpdated;
