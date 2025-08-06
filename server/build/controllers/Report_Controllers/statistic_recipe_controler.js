"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTop5RecipesRecentlyUpdated = exports.handleGetTop5RecipesMostUsed = exports.handleGetTotalRecipes = void 0;
const statistic_recipe_report_1 = require("../../prisma/Report_Services/statistic_recipe_report");
const handleGetTotalRecipes = async (req, res) => {
    try {
        const handle = await (0, statistic_recipe_report_1.getTotalRecipes)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetTotalRecipes:", e);
        res.status(500).json({
            message: "Lỗi server khi tính tổng công thức",
        });
    }
};
exports.handleGetTotalRecipes = handleGetTotalRecipes;
const handleGetTop5RecipesMostUsed = async (req, res) => {
    try {
        const handle = await (0, statistic_recipe_report_1.getTop5RecipesMostUsed)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetTop5RecipesMostUsed:", e);
        res.status(500).json({
            message: "Lỗi server khi tính tổng công thức được dùng nhiều nhất",
        });
    }
};
exports.handleGetTop5RecipesMostUsed = handleGetTop5RecipesMostUsed;
const handleGetTop5RecipesRecentlyUpdated = async (req, res) => {
    try {
        const handle = await (0, statistic_recipe_report_1.getTop5RecipesRecentlyUpdated)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetTop5RecipesRecentlyUpdated:", e);
        res.status(500).json({
            message: "Lỗi server khi tính tổng công thức được cập nhật gần đây",
        });
    }
};
exports.handleGetTop5RecipesRecentlyUpdated = handleGetTop5RecipesRecentlyUpdated;
