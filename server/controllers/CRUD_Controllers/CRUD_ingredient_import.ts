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
  } catch (e) {
    console.error("Lỗi trong controller handleImportIngredientById:", e);
    res.status(500).json({
      message: "Lỗi server khi cập nhập kho nguyên liệu",
    });
  }
};

export { handleImportIngredientById };
