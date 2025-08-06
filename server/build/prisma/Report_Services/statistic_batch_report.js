"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalBatchesByWeekMonthYear = exports.getTotalBaches = void 0;
const client_1 = require("@prisma/client");
const date_fns_tz_1 = require("date-fns-tz");
const date_fns_1 = require("date-fns");
const date_fns_2 = require("date-fns");
const CRUD_batch_service_1 = require("../CRUD_Services/CRUD_batch_service");
const prisma = new client_1.PrismaClient();
const getTotalBaches = async () => {
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
            status: (0, CRUD_batch_service_1.getBatchStatus)(batch.batchSteps, batch.isCancelled ?? false),
        }));
        const totalDone = result.filter((b) => b.status === "Đã hoàn thành").length;
        const totalInProgress = result.filter((b) => b.status.includes("Đang thực hiện")).length;
        const now = new Date();
        // Tính khoảng thời gian tuần / tháng / năm
        const weekStart = (0, date_fns_1.startOfWeek)(now);
        const weekEnd = (0, date_fns_1.endOfWeek)(now);
        const monthStart = (0, date_fns_1.startOfMonth)(now);
        const monthEnd = (0, date_fns_1.endOfMonth)(now);
        const yearStart = (0, date_fns_1.startOfYear)(now);
        const yearEnd = (0, date_fns_1.endOfYear)(now);
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
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách mẻ nấu:", error);
        throw new Error("Lỗi server khi tính tổng mẻ nấu");
    }
};
exports.getTotalBaches = getTotalBaches;
const getTotalBatchesByWeekMonthYear = async () => {
    const now = new Date();
    const monthStart = (0, date_fns_1.startOfMonth)(now);
    const monthEnd = (0, date_fns_1.endOfMonth)(now);
    const yearStart = (0, date_fns_1.startOfYear)(now);
    const yearEnd = (0, date_fns_1.endOfYear)(now);
    // 📅 Thống kê theo từng ngày trong tuần
    const weeklyCountByDay = {};
    // Tạo các key ngày theo định dạng "MM-dd" và khởi tạo = 0
    for (let i = 6; i >= 0; i--) {
        const date = (0, date_fns_1.subDays)(now, i); // lùi ngày
        const label = (0, date_fns_tz_1.format)(date, "MM-dd");
        weeklyCountByDay[label] = 0;
    }
    // Truy vấn tất cả batch trong 7 ngày gần nhất
    const weeklyBatches = await prisma.batch.findMany({
        where: {
            createdAt: {
                gte: (0, date_fns_1.subDays)(now, 6),
                lte: now,
            },
        },
        select: {
            createdAt: true,
        },
    });
    // Đếm batch theo ngày
    for (const b of weeklyBatches) {
        const label = (0, date_fns_tz_1.format)(b.createdAt, "MM-dd");
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
    const weeklyCountByMonth = {};
    let currentStart = monthStart;
    while ((0, date_fns_2.isBefore)(currentStart, monthEnd)) {
        const currentEnd = (0, date_fns_2.addDays)(currentStart, 6);
        const rangeLabel = `${(0, date_fns_tz_1.format)(currentStart, "dd/MM")} - ${(0, date_fns_tz_1.format)((0, date_fns_2.isAfter)(currentEnd, monthEnd) ? monthEnd : currentEnd, "dd/MM")}`;
        weeklyCountByMonth[rangeLabel] = 0;
        currentStart = (0, date_fns_2.addDays)(currentStart, 7);
    }
    // Gán batch vào từng khoảng
    for (const b of monthlyBatches) {
        for (const range in weeklyCountByMonth) {
            const [startStr, endStr] = range.split(" - ");
            const year = now.getFullYear();
            const start = (0, date_fns_2.parse)(`${startStr}/${year}`, "dd/MM/yyyy", new Date());
            const end = (0, date_fns_2.parse)(`${endStr}/${year}`, "dd/MM/yyyy", new Date());
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
    const monthlyCountByYear = {};
    for (let i = 0; i < 12; i++) {
        const monthKey = `${i + 1}`.padStart(2, "0"); // "01", "02", ..., "12"
        monthlyCountByYear[monthKey] = 0;
    }
    for (const b of batches) {
        const month = (0, date_fns_tz_1.format)(b.createdAt, "MM"); // Lấy số tháng "01"..."12"
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
exports.getTotalBatchesByWeekMonthYear = getTotalBatchesByWeekMonthYear;
