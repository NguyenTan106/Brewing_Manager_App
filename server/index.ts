import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import {
  getAllIngredientsController,
  getAllIngredientByIdController,
  createIngredientController,
  updateIngredientByIdController,
  deleteIngredientByIdController,
  getAllTypesController,
  createTypeController,
  deleteTypeController,
  paginationIngredientController,
  getTotalIngredientsController,
  getIngredientStockStatusController,
} from "./routes/api_ingredient";

import {
  getAllBatchesController,
  getBatchByIdController,
  createBatchController,
  deleteBatchByIdController,
  updateBatchByIdController,
  paginationBatchController,
  getTotalBatchesController,
  getGetBatchStatsByWeekMonthYearController,
  updateFeedbackBatchStepsController,
} from "./routes/api_batch";

import {
  getAllRecipesController,
  createRecipesController,
  getRecipeByIdController,
  updateRecipesByIdController,
  deleteRecipesByIdController,
  paginationRecipeAPIController,
  getTotalRecipesController,
  getTop5RecipesMostUsedController,
  getTop5RecipesRecentlyUpdated,
} from "./routes/api_recipe";

import {
  getAllActivityLogsController,
  paginationActivityLogController,
  getActivityLogByIdController,
} from "./routes/api_activity_log";

import { importIngredientByIdController } from "./routes/api_ingredient_import";

import {
  searchIngredientController,
  searchBatchController,
  searchRecipeController,
} from "./routes/api_search";

import {
  createNewUserController,
  loginUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
} from "./routes/api_user";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

//ingredient
app.use("/api", getAllIngredientsController);
app.use("/api", getAllIngredientByIdController);
app.use("/api", createIngredientController);
app.use("/api", updateIngredientByIdController);
app.use("/api", deleteIngredientByIdController);
app.use("/api", getAllTypesController);
app.use("/api", createTypeController);
app.use("/api", deleteTypeController);
app.use("/api", paginationIngredientController);
app.use("/api", getTotalIngredientsController);
app.use("/api", getIngredientStockStatusController);

//ingredient import
app.use("/api", importIngredientByIdController);

//batch
app.use("/api", getAllBatchesController);
app.use("/api", getBatchByIdController);
app.use("/api", createBatchController);
app.use("/api", deleteBatchByIdController);
app.use("/api", updateBatchByIdController);
app.use("/api", paginationBatchController);
app.use("/api", getTotalBatchesController);
app.use("/api", getGetBatchStatsByWeekMonthYearController);
app.use("/api", updateFeedbackBatchStepsController);

//recipe
app.use("/api", getAllRecipesController);
app.use("/api", createRecipesController);
app.use("/api", getRecipeByIdController);
app.use("/api", updateRecipesByIdController);
app.use("/api", deleteRecipesByIdController);
app.use("/api", getTotalBatchesController);
app.use("/api", paginationRecipeAPIController);
app.use("/api", getTotalRecipesController);
app.use("/api", getTop5RecipesMostUsedController);
app.use("/api", getTop5RecipesRecentlyUpdated);

//activity log
app.use("/api", getAllActivityLogsController);
app.use("/api", paginationActivityLogController);
app.use("/api", getActivityLogByIdController);

//search
app.use("/api", searchIngredientController);
app.use("/api", searchBatchController);
app.use("/api", searchRecipeController);

//user
app.use("/api", createNewUserController);
app.use("/api", loginUserController);
app.use("/api", getAllUsersController);
app.use("/api", getUserByIdController);
app.use("/api", updateUserByIdController);
app.use("/api", deleteUserByIdController);

app.listen(PORT, () => {
  console.log(`Brewing Manager backend running at http://localhost:${PORT}`);
});
