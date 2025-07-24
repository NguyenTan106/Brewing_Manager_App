import type { TotalBatchesInfo } from "@/services/statistic_batch_API";
import { type TooltipProps } from "recharts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getTotalBatchesByWeekMonthYearAPI } from "@/services/statistic_batch_API";
interface Props {
  totalBatches: TotalBatchesInfo | null;
}

// Custom Tooltip Component

export function TotalBatches({ totalBatches }: Props) {
  const [viewBy, setViewBy] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );
  const [chartData, setChartData] = useState<{
    weekly: { label: string | number; value: number }[];
    monthly: { label: string | number; value: number }[];
    yearly: { label: string | number; value: number }[];
  }>({
    weekly: [],
    monthly: [],
    yearly: [],
  });

  useEffect(() => {
    handleGetTotalBatchesByWeekMonthYearAPI();
  }, []);

  const handleGetTotalBatchesByWeekMonthYearAPI = async () => {
    const stats = await getTotalBatchesByWeekMonthYearAPI();
    const transformToChartData = (data: Record<string, number>) =>
      Object.entries(data).map(([label, value]) => ({
        label,
        value,
      }));
    setChartData({
      weekly: transformToChartData(stats.weekly),
      monthly: transformToChartData(stats.monthly),
      yearly: transformToChartData(stats.yearly),
    });
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white shadow rounded px-3 py-2 text-sm border border-gray-200">
          <p className="font-medium">{label}</p>
          <p className="text-orange-500">Số mẻ: {payload[0]?.value}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Tổng quan */}
      <div className="grid lg:grid-cols-4 grid-cols-2 text-center lg:text-left">
        <div>
          <p className="text-sm text-gray-500">Tổng số mẻ đã sản xuất</p>
          <h2 className="text-3xl font-bold text-amber-700">
            {totalBatches?.total ?? 0}
          </h2>
        </div>
        <div>
          <p className="text-sm text-gray-500">Đang lên men</p>
          <h2 className="text-3xl font-bold text-amber-700">
            {totalBatches?.totalBatchesInFermenting ?? 0}
          </h2>
        </div>
        <div>
          <p className="text-sm text-gray-500">Đã hoàn thành</p>
          <h2 className="text-3xl font-bold text-amber-700">
            {totalBatches?.totalBatchesDone ?? 0}
          </h2>
        </div>
        <div>
          <p className="text-sm text-gray-500">Đã hủy</p>
          <h2 className="text-3xl font-bold text-amber-700">
            {totalBatches?.totalBatchesCancel ?? 0}
          </h2>
        </div>
      </div>
      {/* Biểu đồ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Biểu đồ sản xuất</h3>
          <Select
            onValueChange={(v) =>
              setViewBy(v as "weekly" | "monthly" | "yearly")
            }
            defaultValue={viewBy}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Xem theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Theo tuần</SelectItem>
              <SelectItem value="monthly">Theo tháng</SelectItem>
              <SelectItem value="yearly">Theo năm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={chartData[viewBy]}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} width={21} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f59e0b"
              fill="url(#fillArea)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
