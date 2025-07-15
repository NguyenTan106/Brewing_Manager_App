import { Request, Response } from "express";

import {
  getAllTypes,
  createType,
  deleteType,
} from "../prisma/CRUD_ingredient_service";
import { typeSchema } from "../middlewares/schema";

const handleGetAllTypes = async (req: Request, res: Response) => {
  try {
    const data = await getAllTypes();

    res.status(200).json(data);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllTypes:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm các loại nguyên liệu",
    });
  }
};

const handleCreateType = async (req: Request, res: Response) => {
  try {
    const parsed = typeSchema.parse(req.body);
    const result = await createType(parsed.typeName);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleCreateType:", e);
    res.status(500).json({
      message: "Lỗi server khi thêm loại nguyên liệu",
    });
  }
};

const handleDeleteType = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const result = await deleteType(id);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleDeleteType:", e);
    res.status(500).json({
      message: "Lỗi server khi xóa loại nguyên liệu",
    });
  }
};

export { handleGetAllTypes, handleCreateType, handleDeleteType };
