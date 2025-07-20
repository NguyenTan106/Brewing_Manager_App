import { Request, Response } from "express";
import { getAllActivityLogs } from "../prisma/CRUD_activityLog_service";
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

export { handleGetAllActivityLogs };
