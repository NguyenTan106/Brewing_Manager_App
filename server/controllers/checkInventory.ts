import { Request, Response } from "express";
import { checkInventoryService } from "../services/checkInventoryService";

const checkInventory = async (req: Request, res: Response) => {
  try {
    const { unit, lowStockThreshold } = req.body;
    const handleCheckInventory = await checkInventoryService(
      unit,
      lowStockThreshold
    );

    res.status(200).json(handleCheckInventory);
  } catch (e) {
    console.error("Lỗi trong controller checkInventory:", e);
    res.status(500).json({
      message: "Lỗi server khi kiểm tra nguyên liệu tồn kho",
    });
  }
};

export { checkInventory };
