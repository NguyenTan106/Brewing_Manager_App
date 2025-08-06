"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRecipeController = exports.searchBatchController = exports.searchIngredientController = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const search_IF_IDF_1 = require("../controllers/search_IF-IDF");
const searchIngredientController = router.post("/search-ingredient", search_IF_IDF_1.searchIngredient);
exports.searchIngredientController = searchIngredientController;
const searchBatchController = router.post("/search-batch", search_IF_IDF_1.searchBatch);
exports.searchBatchController = searchBatchController;
const searchRecipeController = router.post("/search-recipe", search_IF_IDF_1.searchRecipe);
exports.searchRecipeController = searchRecipeController;
