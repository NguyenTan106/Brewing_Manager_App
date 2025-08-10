import type { TotalBatchesInfo } from "@/services/statistic_report/statistic_batch_API";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useEffect, useState } from "react";
import { getTotalBatchesByTimeAPI } from "@/services/statistic_report/statistic_batch_API";
import { TrendingUp } from "lucide-react";
interface Props {
  totalBatches: TotalBatchesInfo | null;
}

const chartConfig = {
  totalBatches: {
    label: "Tổng số mẻ",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TotalBatches({ totalBatches }: Props) {
  const [timeRange, setTimeRange] = useState("30d");
  const [chartData, setChartData] = useState<
    { date: string; totalBatches: number }[]
  >([]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 0;
    if (timeRange === "365d") {
      daysToSubtract = 365;
    } else if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  useEffect(() => {
    handleGetTotalBatchesByTimeAPI();
  }, []);

  const handleGetTotalBatchesByTimeAPI = async () => {
    const stats = await getTotalBatchesByTimeAPI();
    setChartData(stats.data);
  };

  return (
    <>
      {/* Tổng quan */}
      <div className="grid grid-cols-1">
        <Card className="w-full ">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-lg font-bold">Thông tin mẻ</CardTitle>
              <CardDescription>
                Hiển thị tổng số mẻ trong vòng 1 năm
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  7 ngày trước
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  30 ngày trước
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  3 tháng trước
                </SelectItem>
                <SelectItem value="365d" className="rounded-lg">
                  1 năm trước
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-4 grid-cols-2 text-center  pb-5">
              <div>
                <p className="text-sm text-gray-500">Tổng số mẻ đã sản xuất</p>
                <h2 className="text-3xl font-bold text-amber-700">
                  {totalBatches?.total ?? 0}
                </h2>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang thực hiện</p>
                <h2 className="text-3xl font-bold text-amber-700">
                  {totalBatches?.totalInProgress ?? 0}
                </h2>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã hoàn thành</p>
                <h2 className="text-3xl font-bold text-amber-700">
                  {totalBatches?.totalDone ?? 0}
                </h2>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã hủy</p>
                <h2 className="text-3xl font-bold text-amber-700">
                  {totalBatches?.totalCancel ?? 0}
                </h2>
              </div>
            </div>
            {/* Biểu đồ */}

            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient
                    id="fillTotalBatches"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="totalBatches"
                  type="natural"
                  fill="url(#fillTotalBatches)"
                  stroke="var(--chart-1)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Trending up by 5.2% this month
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  January - June 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
