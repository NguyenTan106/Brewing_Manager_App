import { Request, Response } from "express";
import { Ingredient } from "@prisma/client";
import { ZodError } from "zod";
import { compareAndLogChanges } from "../../services/logActivityService";
import { logActivity } from "../../prisma/logActivity";
import {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  deleteRecipeById,
  updateRecipeById,
} from "../../prisma/CRUD_Services/CRUD_recipe_service";
import { recipeSchema } from "../../middlewares/schema";
const handleGetAllRecipes = async (req: Request, res: Response) => {
  try {
    const handle = await getAllRecipes();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllBatches:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm công thức",
    });
  }
};

const handleGetRecipeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const handle = await getRecipeById(id);
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetRecipeById:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm công thức",
    });
  }
};

const handleCreateRecipe = async (req: Request, res: Response) => {
  try {
    // ✅ Validate toàn bộ schema (bao gồm cả recipeSteps)
    const parsed = recipeSchema.parse(req.body);

    const handle = await createRecipe(
      parsed.name,
      parsed.recipeIngredients,
      parsed.recipeSteps,
      parsed.createdById,
      parsed.description,
      parsed.note,
      parsed.instructions
    );

    const data = handle.data;

    // ✅ Trả JSON trước (khuyến khích để tránh lỗi log chặn response)
    res.status(200).json(handle);

    // ✅ Sau đó ghi log (không block response)
    const logCreatedAt = new Date(data.createdAt).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await logActivity(
      "create",
      "Recipe",
      data.id,
      `${data.createdBy.username} đã thêm công thức "${data.name}" vào ${logCreatedAt}`
    );
  } catch (e) {
    console.error("Lỗi trong controller handleCreateRecipe:", e);

    res.status(500).json({
      message: "Lỗi server khi tạo công thức",
    });
  }
};

const handleUpdateRecipeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const oldResult = await getRecipeById(Number(id));

    const parsed = recipeSchema.parse(req.body);
    const result = await updateRecipeById(
      id,
      parsed.name,
      parsed.description,
      parsed.note,
      parsed.instructions,
      parsed.recipeIngredients
    );

    const newData = result.data;
    const oldData = oldResult.data;

    res.status(200).json(result);
    await compareAndLogChanges(
      oldData,
      newData,
      ["name", "description", "note", "instructions", "recipeIngredients"],
      "Recipe",
      newData.id,
      oldData.name
      // userId // nếu có
    );
  } catch (e) {
    console.error("Lỗi trong controller handleUpdateRecipeById:", e);
    res.status(500).json({
      message: "Lỗi server khi cập nhật công thức",
    });
  }
};

const handleDeleteRecipeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const logDeleteDate = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const deleted = await deleteRecipeById(id);
    res.status(200).json(deleted);
    const data = deleted.data;
    await logActivity(
      "delete",
      "Recipe",
      data.id,
      `Xóa công thức ${data.id}: "${data.name}" vào ngày ${logDeleteDate}`
      // userId // nếu có
    );
  } catch (e) {
    console.error("Lỗi trong controller handleDeleteRecipeById:", e);
    res.status(500).json({
      message: "Lỗi server khi xóa công thức",
    });
  }
};

export {
  handleGetAllRecipes,
  handleCreateRecipe,
  handleGetRecipeById,
  handleUpdateRecipeById,
  handleDeleteRecipeById,
};
