import { Request, Response } from "express";
import { importIngredient } from "../../prisma/CRUD_Services/CRUD_ingredientImport_service";
import { compareAndLogChanges } from "../../services/logActivityService";
import { logActivity } from "../../prisma/logActivity";
import { ingredientImportSchema } from "../../middlewares/schema";

const handleImportIngredientById = async (req: Request, res: Response) => {
  try {
    const parsed = ingredientImportSchema.parse(req.body);

    const handle = await importIngredient({
      ingredientId: Number(parsed.ingredientId),
      amount: Number(parsed.amount),
      notes: parsed.notes || null,
      createdBy: parsed.createdBy || null,
    });

    res.status(200).json(handle);
    const data = handle.data;
    const logLastImportDate = new Date(data.updatedAt).toLocaleString("vi-VN", {
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
      "Ingredient Import",
      data.id,
      `Nhập kho nguyên liệu "${data.ingredient.name}" với số lượng ${data.amount} ${data.ingredient.unit} vào ${logLastImportDate}`
      // userId // nếu có
    );
  } catch (e) {
    console.error("Lỗi trong controller handleImportIngredientById:", e);
    res.status(500).json({
      message: "Lỗi server khi cập nhập kho nguyên liệu",
    });
  }
};

export { handleImportIngredientById };
