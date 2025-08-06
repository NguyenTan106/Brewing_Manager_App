"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRecipe = exports.searchBatch = exports.searchIngredient = void 0;
const tfidfService_1 = require("../services/tfidfService");
const CRUD_ingredient_service_1 = require("../prisma/CRUD_Services/CRUD_ingredient_service");
const CRUD_batch_service_1 = require("../prisma/CRUD_Services/CRUD_batch_service");
const CRUD_recipe_service_1 = require("../prisma/CRUD_Services/CRUD_recipe_service");
const searchIngredient = async (req, res) => {
    const query = req.body.query;
    if (!query)
        return res.status(400).json({ error: "Missing query" });
    try {
        // 👉 Lấy số lượng sách
        const total = await (0, CRUD_ingredient_service_1.getAllIngredients)();
        // ✅ Tính TF-IDF
        const tfidfResults = await (0, tfidfService_1.computeTfIdf)(query, total.data);
        // console.log(tfidfResults);
        const sorted = tfidfResults.sort((a, b) => b.score - a.score);
        res.json(sorted);
    }
    catch (err) {
        console.error("Lỗi khi tìm nguyên liệu:", err);
        res.status(500).json({ error: "Không thể tìm nguyên liệu" });
    }
};
exports.searchIngredient = searchIngredient;
const searchBatch = async (req, res) => {
    const query = req.body.query;
    if (!query)
        return res.status(400).json({ error: "Missing query" });
    try {
        // 👉 Lấy số lượng sách
        const total = await (0, CRUD_batch_service_1.getAllBatches)();
        // ✅ Tính TF-IDF
        const tfidfResults = await (0, tfidfService_1.computeTfIdf)(query, total.data);
        // console.log(tfidfResults);
        const sorted = tfidfResults.sort((a, b) => b.score - a.score);
        res.json(sorted);
    }
    catch (err) {
        console.error("Lỗi khi tìm mẻ:", err);
        res.status(500).json({ error: "Không thể tìm mẻ" });
    }
};
exports.searchBatch = searchBatch;
const searchRecipe = async (req, res) => {
    const query = req.body.query;
    if (!query)
        return res.status(400).json({ error: "Missing query" });
    try {
        // 👉 Lấy số lượng sách
        const total = await (0, CRUD_recipe_service_1.getAllRecipes)();
        // ✅ Tính TF-IDF
        const tfidfResults = await (0, tfidfService_1.computeTfIdf)(query, total.data);
        // console.log(tfidfResults);
        const sorted = tfidfResults.sort((a, b) => b.score - a.score);
        res.json(sorted);
    }
    catch (err) {
        console.error("Lỗi khi tìm công thức:", err);
        res.status(500).json({ error: "Không thể tìm công thức" });
    }
};
exports.searchRecipe = searchRecipe;
