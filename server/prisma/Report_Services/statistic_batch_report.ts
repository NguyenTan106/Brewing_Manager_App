import { PrismaClient } from "@prisma/client";
import { format } from "date-fns-tz";
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
  getWeek,
  subDays,
} from "date-fns";
import { addDays, isBefore, isAfter, parse } from "date-fns";
import { getBatchStatus } from "../CRUD_Services/CRUD_batch_service";
const prisma = new PrismaClient();

const getTotalBaches = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const total = await prisma.batch.count({ where: { isCancelled: false } });
    const totalCancel = await prisma.batch.count({
      where: { isCancelled: true },
    });
    const allBatches = await prisma.batch.findMany({
      where: {
        isCancelled: false, // chỉ tính các mẻ không bị hủy
      },
      include: {
        batchSteps: true,
      },
    });

    const result = allBatches.map((batch) => ({
      id: batch.id,
      status: getBatchStatus(batch.batchSteps, batch.isCancelled ?? false),
    }));

    const totalDone = result.filter((b) => b.status === "Đã hoàn thành").length;
    const totalInProgress = result.filter((b) =>
      b.status.includes("Đang thực hiện")
    ).length;

    const now = new Date();

    // Tính khoảng thời gian tuần / tháng / năm
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const weeklyTotal = await prisma.batch.count({
      where: {
        isCancelled: false,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    const monthlyTotal = await prisma.batch.count({
      where: {
        isCancelled: false,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const yearlyTotal = await prisma.batch.count({
      where: {
        isCancelled: false,
        createdAt: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
    });

    return {
      message: "Thành công",
      data: {
        total,
        totalInProgress,
        totalDone,
        totalCancel,
        byTime: {
          weeklyTotal,
          monthlyTotal,
          yearlyTotal,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mẻ nấu:", error);
    throw new Error("Lỗi server khi tính tổng mẻ nấu");
  }
};

const getTotalBatchesByTime = async () => {
  const now = new Date();

  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  const result = await prisma.batch.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    _count: {
      _all: true,
    },
  });

  const data = result.map((item) => ({
    date: item.createdAt.toISOString().split("T")[0],
    totalBatches: item._count._all,
  }));

  return {
    data: data,
  };
};

export { getTotalBaches, getTotalBatchesByTime };
