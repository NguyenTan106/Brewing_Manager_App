"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetIngredientStockStatus = exports.handleGetTotalIngredients = void 0;
const statistic_ingredient_report_1 = require("../../prisma/Report_Services/statistic_ingredient_report");
const handleGetTotalIngredients = async (req, res) => {
    try {
        const handle = await (0, statistic_ingredient_report_1.getTotalIngredients)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetTotalIngredients:", e);
        res.status(500).json({
            message: "Lỗi server khi tính tổng nguyên liệu",
        });
    }
};
exports.handleGetTotalIngredients = handleGetTotalIngredients;
const handleGetIngredientStockStatus = async (req, res) => {
    try {
        const handle = await (0, statistic_ingredient_report_1.getIngredientStockStatus)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetIngredientStockStatus:", e);
        res.status(500).json({
            message: "Lỗi server khi tính tổng nguyên liệu",
        });
    }
};
exports.handleGetIngredientStockStatus = handleGetIngredientStockStatus;
