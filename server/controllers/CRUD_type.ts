import { Request, Response } from "express";

import { getAllTypes, createType } from "../prisma/seed";
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
    const data = result.data;
    res.status(200).json(data);
  } catch (e) {
    console.error("Lỗi trong controller handleCreateType:", e);
    res.status(500).json({
      message: "Lỗi server khi thêm loại nguyên liệu",
    });
  }
};
export { handleGetAllTypes, handleCreateType };
