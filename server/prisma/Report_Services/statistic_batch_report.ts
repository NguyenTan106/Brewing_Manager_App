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

const getTotalBatchesByWeekMonthYear = async () => {
  const now = new Date();

  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  // 📅 Thống kê theo từng ngày trong tuần
  const weeklyCountByDay: Record<string, number> = {};
  // Tạo các key ngày theo định dạng "MM-dd" và khởi tạo = 0
  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i); // lùi ngày
    const label = format(date, "MM-dd");
    weeklyCountByDay[label] = 0;
  }

  // Truy vấn tất cả batch trong 7 ngày gần nhất
  const weeklyBatches = await prisma.batch.findMany({
    where: {
      createdAt: {
        gte: subDays(now, 6),
        lte: now,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Đếm batch theo ngày
  for (const b of weeklyBatches) {
    const label = format(b.createdAt, "MM-dd");
    if (weeklyCountByDay[label] !== undefined) {
      weeklyCountByDay[label]++;
    }
  }

  // 📅 Thống kê theo từng ngày trong tháng
  const monthlyBatches = await prisma.batch.findMany({
    where: {
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const weeklyCountByMonth: Record<string, number> = {};

  let currentStart = monthStart;

  while (isBefore(currentStart, monthEnd)) {
    const currentEnd = addDays(currentStart, 6);
    const rangeLabel = `${format(currentStart, "dd/MM")} - ${format(
      isAfter(currentEnd, monthEnd) ? monthEnd : currentEnd,
      "dd/MM"
    )}`;

    weeklyCountByMonth[rangeLabel] = 0;
    currentStart = addDays(currentStart, 7);
  }

  // Gán batch vào từng khoảng
  for (const b of monthlyBatches) {
    for (const range in weeklyCountByMonth) {
      const [startStr, endStr] = range.split(" - ");
      const year = now.getFullYear();

      const start = parse(`${startStr}/${year}`, "dd/MM/yyyy", new Date());
      const end = parse(`${endStr}/${year}`, "dd/MM/yyyy", new Date());

      if (b.createdAt >= start && b.createdAt <= end) {
        weeklyCountByMonth[range]++;
        break;
      }
    }
  }
  // Lấy tất cả các mẻ trong năm hiện tại
  const batches = await prisma.batch.findMany({
    where: {
      createdAt: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Tạo bộ đếm theo tháng
  const monthlyCountByYear: Record<string, number> = {};

  for (let i = 0; i < 12; i++) {
    const monthKey = `${i + 1}`.padStart(2, "0"); // "01", "02", ..., "12"
    monthlyCountByYear[monthKey] = 0;
  }

  for (const b of batches) {
    const month = format(b.createdAt, "MM"); // Lấy số tháng "01"..."12"
    if (monthlyCountByYear[month] !== undefined) {
      monthlyCountByYear[month]++;
    }
  }

  return {
    weekly: weeklyCountByDay,
    monthly: weeklyCountByMonth,
    yearly: monthlyCountByYear,
  };
};

export { getTotalBaches, getTotalBatchesByWeekMonthYear };
