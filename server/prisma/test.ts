import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const postTempFromESP32 = async (
  batchId: number,
  temperature: number
): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const tempLog = await prisma.temperatureLog.create({
      data: {
        batchId,
        temperature: Number(temperature),
      },
    });

    return {
      message: "Thành công",
      data: tempLog,
    };
  } catch (error) {
    console.error("Lỗi khi lấy lưu nhiệt độ nước:", error);
    throw new Error("Lỗi server khi lưu nhiệt độ nước");
  }
};

export const getAllTemps = async (
  batchId: number
): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const logs = await prisma.temperatureLog.findMany({
      where: { batchId },
      orderBy: { timestamp: "asc" },
    });

    return {
      message: "Thành công",
      data: logs,
    };
  } catch (error) {
    console.error("Lỗi khi lấy lấy nhiệt độ nước:", error);
    throw new Error("Lỗi server khi truy xuất nhiệt độ nước");
  }
};
