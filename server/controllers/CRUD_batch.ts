import { Request, Response } from "express";

import { getAllBatches, getBatchById } from "../prisma/CRUD_batch_service";

const handleGetAllBatches = async (req: Request, res: Response) => {
  try {
    const handle = await getAllBatches();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllBatchs:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm mẻ",
    });
  }
};

const handleGetBatchById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const handle = await getBatchById(id);
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetBatchById:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm mẻ",
    });
  }
};

export { handleGetAllBatches, handleGetBatchById };
