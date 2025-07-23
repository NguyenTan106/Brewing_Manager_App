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
} from "date-fns";

const prisma = new PrismaClient();

const getTotalBaches = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const total = await prisma.batch.count();
    const totalBatchesInFermenting = await prisma.batch.count({
      where: { status: "fermenting" },
    });
    const totalBatchesDone = await prisma.batch.count({
      where: { status: "done" },
    });
    const totalBatchesCancel = await prisma.batch.count({
      where: { status: "cancel" },
    });

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
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    const monthlyTotal = await prisma.batch.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const yearlyTotal = await prisma.batch.count({
      where: {
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
        totalBatchesInFermenting,
        totalBatchesDone,
        totalBatchesCancel,
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

  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  // 📅 Thống kê theo từng ngày trong tuần
  const weeklyBatches = await prisma.batch.findMany({
    where: {
      createdAt: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const weeklyCountByDay: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const day = format(
      new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() + i
      ),
      "MM-dd"
    );
    weeklyCountByDay[day] = 0;
  }

  for (const b of weeklyBatches) {
    const day = format(b.createdAt, "MM-dd");
    if (weeklyCountByDay[day] !== undefined) {
      weeklyCountByDay[day]++;
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

  // Tuần đầu tiên của tháng (số tuần ISO)
  const startWeek = getWeek(monthStart, { weekStartsOn: 1 }); // Tuần bắt đầu từ Thứ 2

  const weeklyCountByMonth: Record<string, number> = {};

  for (const b of monthlyBatches) {
    const batchWeek = getWeek(b.createdAt, { weekStartsOn: 1 });
    const weekNumberInMonth = batchWeek - startWeek + 1;

    const key = `Tuần ${weekNumberInMonth}`;
    weeklyCountByMonth[key] = (weeklyCountByMonth[key] || 0) + 1;
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
