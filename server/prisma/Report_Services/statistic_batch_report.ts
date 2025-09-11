import { PrismaClient } from "@prisma/client";
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
} from "date-fns";
import { getBatchStatus } from "../CRUD_Services/CRUD_batch_service";
const prisma = new PrismaClient();

const getTotalBaches = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const total = await prisma.batch.count({});
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

  // Tổng số mẻ
  const result = await prisma.batch.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    _count: { _all: true },
  });

  // Mẻ bị hủy
  const cancelledBatches = await prisma.batch.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: {
        gte: yearStart,
        lte: yearEnd,
      },
      isCancelled: true,
    },
    _count: { _all: true },
  });

  // Mẻ hoàn thành
  const completedBatches = await prisma.batch.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: {
        gte: yearStart,
        lte: yearEnd,
      },
      isCancelled: false,
    },
    _count: { _all: true },
  });

  // Merge dữ liệu
  const data = result.map((item) => {
    const dateStr = item.createdAt.toISOString().split("T")[0];
    const cancelled =
      cancelledBatches.find(
        (c) => c.createdAt.toISOString().split("T")[0] === dateStr
      )?._count._all || 0;

    const completed =
      completedBatches.find(
        (c) => c.createdAt.toISOString().split("T")[0] === dateStr
      )?._count._all || 0;

    return {
      date: dateStr,
      totalBatches: item._count._all,
      cancelledBatches: cancelled,
      completedBatches: completed,
    };
  });

  return { data };
};

// | Ngày / Tháng | Tổng số mẻ | Mức thay đổi (%) | Trạng thái cảnh báo      | Ghi chú                            |
// | ------------ | ---------- | ---------------- | ------------------------ | ---------------------------------- |
// | 2024-04-01   | 222        | +15%             | 🔼 Tăng đột biến         | Cao hơn trung bình 7 ngày gần nhất |
// | 2024-04-02   | 97         | -56%             | ⚠ Giảm mạnh              | Thấp hơn ngưỡng 100 mẻ/ngày        |
// | 2024-04-03   | 110        | +13%             | Bình thường              | —                                  |
// | 2024-04-04   | 50         | -55%             | 🔴 Cảnh báo nghiêm trọng | Có sự cố máy móc ở xưởng           |

type BatchMonthSummary = {
  month: Date;
  totalBatches: number;
  cancelledBatches: number;
};

type BatchStat = {
  month: string;
  totalBatches: number;
  changePercent: string;
  alertStatus: string;
  note: string;
};

function analyzeBatchData(
  data: { month: string; totalBatches: number; cancelledBatches: number }[]
): BatchStat[] {
  return data.map((item, index) => {
    const cancelledPercent =
      item.totalBatches === 0
        ? 0
        : (item.cancelledBatches / item.totalBatches) * 100;

    if (index === 0) {
      let alertStatus = "Bình thường";
      let note = "Tháng đầu tiên";

      if (cancelledPercent >= 20) {
        alertStatus = "⚠ Nhiều mẻ bị huỷ";
        note = `Tỷ lệ huỷ ${Math.round(cancelledPercent)}%`;
      }

      return {
        ...item,
        changePercent: "0%",
        alertStatus,
        note,
      };
    }
    const prev = data[index - 1];
    const diff = item.totalBatches - prev.totalBatches;
    const changePercentNum =
      prev.totalBatches === 0 ? 100 : (diff / prev.totalBatches) * 100;
    const changePercent = `${changePercentNum >= 0 ? "+" : ""}${Math.round(
      changePercentNum
    )}%`;

    let alertStatus = "Bình thường";
    let note = "—";

    if (cancelledPercent >= 20) {
      alertStatus = "⚠ Nhiều mẻ bị huỷ";
      note = `Tỷ lệ huỷ ${Math.round(cancelledPercent)}%`;
    } else if (changePercentNum >= 50) {
      alertStatus = "🔼 Tăng đột biến";
      note = "Cao hơn trung bình kỳ trước";
    } else if (changePercentNum <= -30) {
      alertStatus = "🔻 Giảm mạnh";
      note = "Thấp hơn bình thường";
    }

    return {
      ...item,
      changePercent,
      alertStatus,
      note,
    };
  });
}

const getBatchSummaryByDateRange = async () => {
  const now = new Date();

  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  const result = await prisma.$queryRaw<BatchMonthSummary[]>`
  SELECT 
    DATE_TRUNC('month', "createdAt") AS month,
    COALESCE(COUNT(*)::int, 0) AS "totalBatches",
    COALESCE(SUM(CASE WHEN "isCancelled" = true THEN 1 ELSE 0 END)::int, 0) AS "cancelledBatches"
  FROM "Batch"
  WHERE "createdAt" >= ${yearStart} 
    AND "createdAt" <= ${yearEnd}
  GROUP BY month
  ORDER BY month ASC
`;

  const rawData = result.map((item) => ({
    month: item.month.toISOString().slice(0, 7),
    totalBatches: item.totalBatches,
    cancelledBatches: item.cancelledBatches,
  }));
  return { data: analyzeBatchData(rawData) };
};

export { getTotalBaches, getTotalBatchesByTime, getBatchSummaryByDateRange };
