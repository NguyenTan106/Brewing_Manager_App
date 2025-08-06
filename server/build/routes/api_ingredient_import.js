"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importIngredientByIdController = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const CRUD_ingredient_import_1 = require("../controllers/CRUD_Controllers/CRUD_ingredient_import");
const importIngredientByIdController = router.post("/ingredient-imports", CRUD_ingredient_import_1.handleImportIngredientById);
exports.importIngredientByIdController = importIngredientByIdController;
