"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const api_ingredient_1 = require("./routes/api_ingredient");
const api_batch_1 = require("./routes/api_batch");
const api_recipe_1 = require("./routes/api_recipe");
const api_activity_log_1 = require("./routes/api_activity_log");
const api_ingredient_import_1 = require("./routes/api_ingredient_import");
const api_search_1 = require("./routes/api_search");
const api_user_1 = require("./routes/api_user");
const api_send_email_1 = require("./routes/api_send_email");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// app.use(
//   cors({
//     origin: "https://brewing-manager-app-client.vercel.app",
//     credentials: true, // nếu bạn dùng cookie hoặc header auth
//   })
// );
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//ingredient
app.use("/api", api_ingredient_1.getAllIngredientsController);
app.use("/api", api_ingredient_1.getAllIngredientByIdController);
app.use("/api", api_ingredient_1.createIngredientController);
app.use("/api", api_ingredient_1.updateIngredientByIdController);
app.use("/api", api_ingredient_1.deleteIngredientByIdController);
app.use("/api", api_ingredient_1.getAllTypesController);
app.use("/api", api_ingredient_1.createTypeController);
app.use("/api", api_ingredient_1.deleteTypeController);
app.use("/api", api_ingredient_1.paginationIngredientController);
app.use("/api", api_ingredient_1.getTotalIngredientsController);
app.use("/api", api_ingredient_1.getIngredientStockStatusController);
//ingredient import
app.use("/api", api_ingredient_import_1.importIngredientByIdController);
//batch
app.use("/api", api_batch_1.getAllBatchesController);
app.use("/api", api_batch_1.getBatchByIdController);
app.use("/api", api_batch_1.createBatchController);
app.use("/api", api_batch_1.deleteBatchByIdController);
app.use("/api", api_batch_1.updateBatchByIdController);
app.use("/api", api_batch_1.paginationBatchController);
app.use("/api", api_batch_1.getTotalBatchesController);
app.use("/api", api_batch_1.getGetBatchStatsByWeekMonthYearController);
app.use("/api", api_batch_1.updateFeedbackBatchStepController);
app.use("/api", api_batch_1.getBatchStepByIdController);
//recipe
app.use("/api", api_recipe_1.getAllRecipesController);
app.use("/api", api_recipe_1.createRecipesController);
app.use("/api", api_recipe_1.getRecipeByIdController);
app.use("/api", api_recipe_1.updateRecipesByIdController);
app.use("/api", api_recipe_1.deleteRecipesByIdController);
app.use("/api", api_batch_1.getTotalBatchesController);
app.use("/api", api_recipe_1.paginationRecipeAPIController);
app.use("/api", api_recipe_1.getTotalRecipesController);
app.use("/api", api_recipe_1.getTop5RecipesMostUsedController);
app.use("/api", api_recipe_1.getTop5RecipesRecentlyUpdated);
//activity log
app.use("/api", api_activity_log_1.getAllActivityLogsController);
app.use("/api", api_activity_log_1.paginationActivityLogController);
app.use("/api", api_activity_log_1.getActivityLogByIdController);
//search
app.use("/api", api_search_1.searchIngredientController);
app.use("/api", api_search_1.searchBatchController);
app.use("/api", api_search_1.searchRecipeController);
//user
app.use("/api", api_user_1.createNewUserController);
app.use("/api", api_user_1.loginUserController);
app.use("/api", api_user_1.getAllUsersController);
app.use("/api", api_user_1.getUserByIdController);
app.use("/api", api_user_1.updateUserByIdController);
app.use("/api", api_user_1.deleteUserByIdController);
// email
app.use("/api", api_send_email_1.sendAlertEmailService);
app.listen(PORT, () => {
    console.log(`Brewing Manager backend running at http://localhost:${PORT}`);
});
