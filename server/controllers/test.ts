import { getAllTemps, postTempFromESP32 } from "./../prisma/test";
import { Request, Response } from "express";

let lastTemperature: string | null = null;
const getTempFromESP32 = async (req: Request, res: Response) => {
  try {
    const temp = req.query.temp as string | undefined;
    if (temp) {
      lastTemperature = temp;
      console.log(`Received temperature: ${temp} °C`);
      res.json({ success: true, temperature: temp, message: "Thành công" });
    } else {
      res.status(400).json({
        success: false,
        temperature: null,
        message: "Không có nhiệt độ nào",
      });
    }
  } catch (e) {
    console.error("Lỗi trong controller getTempFromESP32:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy nhiệt độ nước",
    });
  }
};

const getLastestTempFromESP32 = async (req: Request, res: Response) => {
  if (lastTemperature) {
    res.json({ temperature: lastTemperature });
  } else {
    res.status(404).json({ message: "Chưa có dữ liệu nhiệt độ" });
  }
};

const handlePostTempFromESP32 = async (req: Request, res: Response) => {
  try {
    const { batchId, temperature } = req.body;

    if (!batchId || temperature === undefined) {
      return res
        .status(400)
        .json({ message: "batchId và temperature là bắt buộc" });
    }

    const tempLog = await postTempFromESP32(batchId, temperature);

    res.json({ success: true, data: tempLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lưu nhiệt độ" });
  }
};

const handleGetAllTemps = async (req: Request, res: Response) => {
  try {
    const batchId = Number(req.query.batchId);

    if (!batchId) {
      return res.status(400).json({ message: "batchId không hợp lệ" });
    }

    const logs = await getAllTemps(batchId);

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử nhiệt độ" });
  }
};

export {
  getTempFromESP32,
  getLastestTempFromESP32,
  handlePostTempFromESP32,
  handleGetAllTemps,
};
