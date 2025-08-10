import { Request, Response } from "express";
import {
  getTotalBaches,
  getTotalBatchesByTime,
} from "../../prisma/Report_Services/statistic_batch_report";

const handleGetTotalBatches = async (req: Request, res: Response) => {
  try {
    const handle = await getTotalBaches();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetTotalBatches:", e);
    res.status(500).json({
      message: "Lỗi server khi tính tổng mẻ",
    });
  }
};

const handleGetTotalBatchesByTime = async (req: Request, res: Response) => {
  try {
    const handle = await getTotalBatchesByTime();
    res.status(200).json(handle);
  } catch (e) {
    console.error(
      "Lỗi trong controller handleGetTotalBatchesByDayWeekYear:",
      e
    );
    res.status(500).json({
      message: "Lỗi server khi tính tổng mẻ theo tuần / tháng / năm",
    });
  }
};

export { handleGetTotalBatches, handleGetTotalBatchesByTime };
