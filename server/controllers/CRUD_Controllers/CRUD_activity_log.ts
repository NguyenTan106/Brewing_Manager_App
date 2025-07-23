import { Request, Response } from "express";
import {
  getAllActivityLogs,
  getActivityLogById,
} from "../../prisma/CRUD_Services/CRUD_activityLog_service";
const handleGetAllActivityLogs = async (req: Request, res: Response) => {
  try {
    const handle = await getAllActivityLogs();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllLogs:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm nhật kí hoạt động",
    });
  }
};

const handleGetActivityLogById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const handle = await getActivityLogById(id);
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetActivityLogById:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm nhật kí hoạt động",
    });
  }
};

export { handleGetAllActivityLogs, handleGetActivityLogById };
