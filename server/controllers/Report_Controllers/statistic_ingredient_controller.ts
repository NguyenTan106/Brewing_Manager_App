import { Request, Response } from "express";
import {
  getTotalIngredients,
  getIngredientStockStatus,
} from "../../prisma/Report_Services/statistic_ingredient_report";

const handleGetTotalIngredients = async (req: Request, res: Response) => {
  try {
    const handle = await getTotalIngredients();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetTotalIngredients:", e);
    res.status(500).json({
      message: "Lỗi server khi tính tổng nguyên liệu",
    });
  }
};

const handleGetIngredientStockStatus = async (req: Request, res: Response) => {
  try {
    const handle = await getIngredientStockStatus();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetIngredientStockStatus:", e);
    res.status(500).json({
      message: "Lỗi server khi tính tổng nguyên liệu",
    });
  }
};

export { handleGetTotalIngredients, handleGetIngredientStockStatus };
