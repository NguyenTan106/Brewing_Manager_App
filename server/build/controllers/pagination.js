"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaginationActivityLog = exports.handlePaginationRecipe = exports.handlePaginationBatch = exports.handlePaginationIngredient = void 0;
const CRUD_ingredient_service_1 = require("../prisma/CRUD_Services/CRUD_ingredient_service");
const CRUD_batch_service_1 = require("../prisma/CRUD_Services/CRUD_batch_service");
const CRUD_recipe_service_1 = require("../prisma/CRUD_Services/CRUD_recipe_service");
const CRUD_activityLog_service_1 = require("../prisma/CRUD_Services/CRUD_activityLog_service");
const handlePaginationIngredient = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await (0, CRUD_ingredient_service_1.getIngredientPage)(page, limit);
    res.json(result);
};
exports.handlePaginationIngredient = handlePaginationIngredient;
const handlePaginationBatch = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await (0, CRUD_batch_service_1.getBatchPage)(page, limit);
    res.json(result);
};
exports.handlePaginationBatch = handlePaginationBatch;
const handlePaginationRecipe = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await (0, CRUD_recipe_service_1.getRecipePage)(page, limit);
    res.json(result);
};
exports.handlePaginationRecipe = handlePaginationRecipe;
const handlePaginationActivityLog = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await (0, CRUD_activityLog_service_1.getActivityLogPage)(page, limit);
    res.json(result);
};
exports.handlePaginationActivityLog = handlePaginationActivityLog;
