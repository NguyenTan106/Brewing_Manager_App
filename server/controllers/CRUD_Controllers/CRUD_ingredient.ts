import { Request, Response } from "express";
import { ZodError } from "zod";

import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredientById,
  deleteIngredientById,
} from "../../prisma/CRUD_Services/CRUD_ingredient_service";
import { ingredientSchema } from "../../middlewares/schema";
import { compareAndLogChanges } from "../../services/logActivityService";
import { logActivity } from "../../prisma/logActivity";
const handleGetAllIngredients = async (req: Request, res: Response) => {
  try {
    const handle = await getAllIngredients();

    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllIngredients:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm nguyên liệu",
    });
  }
};

const handleGetAllIngredientById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const handle = await getIngredientById(Number(id));
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllIngredientById:", e);
    res.status(500).json({
      message: `Lỗi server khi tìm nguyên liệu có id=${id}`,
    });
  }
};

const handleCreateIngredient = async (req: Request, res: Response) => {
  try {
    // ✅ Validate đầu vào
    const parsed = ingredientSchema.parse(req.body);

    const lastImportDate = new Date(parsed.lastImportDate);
    const logLastImportDate = new Date(parsed.lastImportDate).toLocaleString(
      "vi-VN",
      {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    const result = await createIngredient(
      parsed.name,
      parsed.type,
      parsed.unit,
      parsed.quantity,
      parsed.lowStockThreshold,
      lastImportDate,
      parsed.notes || ""
    );
    const data = result.data;

    res.status(201).json(result);
    await logActivity(
      "create",
      "Ingredient",
      data.id,
      `Thêm nguyên liệu "${data.name}" với số lượng ${data.quantity} ${data.unit} vào ${logLastImportDate}`
      // userId // nếu có
    );
  } catch (e) {
    if (e instanceof ZodError) {
      const errMessage = e._zod.def;
      const err = errMessage.map((e) => e.message);
      console.error(
        "Lỗi trong controller handleCreateIngredient:",
        err.toString()
      );
      res.status(500).json({
        message: err.toString(),
      });
    }
  }
};

const handleUpdateIngredientById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
      type,
      unit,
      quantity,
      lowStockThreshold,
      lastImportDate,
      notes,
    } = req.body;

    const oldResult = await getIngredientById(Number(id));

    const result = await updateIngredientById(id, {
      name: name,
      type: type,
      unit: unit,
      quantity: Number(quantity),
      lowStockThreshold: Number(lowStockThreshold),
      lastImportDate: lastImportDate,
      notes: notes,
    });

    const newData = result.data;
    const oldData = oldResult.data;

    res.status(200).json(result);
    await compareAndLogChanges(
      oldData,
      newData,
      [
        "name",
        "type",
        "unit",
        "quantity",
        "lowStockThreshold",
        "lastImportDate",
        "notes",
      ],
      "Ingredient",
      newData.id,
      oldData.name
      // userId // nếu có
    );
  } catch (e) {
    console.error("Lỗi trong controller handleUpdateIngredientById:", e);
    res.status(500).json({
      message: "Lỗi server khi cập nhật nguyên liệu",
    });
  }
};

const handleDeleteIngredientById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const logDeleteDate = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const result = await deleteIngredientById(id);
    res.status(200).json(result);
    const data = result.data;
    await logActivity(
      "delete",
      "Ingredient",
      data.id,
      `Xóa nguyên liệu ${data.id}: "${data.name}" vào ${logDeleteDate}`
      // userId // nếu có
    );
  } catch (e) {
    console.error("Lỗi trong controller handleDeleteIngredientById:", e);
    res.status(500).json({
      message: "Lỗi server khi xóa nguyên liệu",
    });
  }
};

export {
  handleGetAllIngredients,
  handleGetAllIngredientById,
  handleCreateIngredient,
  handleUpdateIngredientById,
  handleDeleteIngredientById,
};
