"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTotalBatchesByDayWeekYear = exports.handleGetTotalBatches = void 0;
const statistic_batch_report_1 = require("../../prisma/Report_Services/statistic_batch_report");
const handleGetTotalBatches = async (req, res) => {
    try {
        const handle = await (0, statistic_batch_report_1.getTotalBaches)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetTotalBatches:", e);
        res.status(500).json({
            message: "Lỗi server khi tính tổng mẻ",
        });
    }
};
exports.handleGetTotalBatches = handleGetTotalBatches;
const handleGetTotalBatchesByDayWeekYear = async (req, res) => {
    try {
        const handle = await (0, statistic_batch_report_1.getTotalBatchesByWeekMonthYear)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetTotalBatchesByDayWeekYear:", e);
        res.status(500).json({
            message: "Lỗi server khi tính tổng mẻ theo tuần / tháng / năm",
        });
    }
};
exports.handleGetTotalBatchesByDayWeekYear = handleGetTotalBatchesByDayWeekYear;
