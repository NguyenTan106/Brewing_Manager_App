import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  getBatchSummaryByDateRangeAPI,
  getTotalBatchesByTimeAPI,
} from "@/services/statistic_report/statistic_batch_API";
import { getAllTempsAPI, type TemperatureLog } from "@/services/test/test_API";

const sampleData = [
  {
    month: "2024-01",
    totalBatches: 12,
    cancelledBatches: 1,
    changePercent: "+15%",
    alertStatus: "🔼 Tăng nhẹ",
    note: "Hoạt động ổn định",
  },
  {
    month: "2024-02",
    totalBatches: 14,
    cancelledBatches: 2,
    changePercent: "+17%",
    alertStatus: "🔼 Tăng ổn định",
    note: "Nhu cầu tăng",
  },
  {
    month: "2024-03",
    totalBatches: 9,
    cancelledBatches: 1,
    changePercent: "-35%",
    alertStatus: "🔻 Giảm mạnh",
    note: "Thiếu nguyên liệu",
  },
  {
    month: "2024-04",
    totalBatches: 15,
    cancelledBatches: 0,
    changePercent: "+66%",
    alertStatus: "🔼 Tăng đột biến",
    note: "Thêm đơn hàng mới",
  },
  {
    month: "2024-05",
    totalBatches: 18,
    cancelledBatches: 2,
    changePercent: "+20%",
    alertStatus: "🔼 Tăng ổn định",
    note: "Đáp ứng mùa cao điểm",
  },
  {
    month: "2024-06",
    totalBatches: 16,
    cancelledBatches: 3,
    changePercent: "-11%",
    alertStatus: "🔻 Giảm nhẹ",
    note: "Khách hàng hủy đơn",
  },
  {
    month: "2024-07",
    totalBatches: 20,
    cancelledBatches: 1,
    changePercent: "+25%",
    alertStatus: "🔼 Tăng mạnh",
    note: "Sản lượng cao",
  },
  {
    month: "2024-08",
    totalBatches: 22,
    cancelledBatches: 0,
    changePercent: "+10%",
    alertStatus: "🔼 Tăng nhẹ",
    note: "Ổn định",
  },
  {
    month: "2024-09",
    totalBatches: 21,
    cancelledBatches: 2,
    changePercent: "-4%",
    alertStatus: "⚠ Ổn định nhưng cần theo dõi",
    note: "Nguyên liệu dự trữ giảm",
  },
  {
    month: "2024-10",
    totalBatches: 25,
    cancelledBatches: 1,
    changePercent: "+19%",
    alertStatus: "🔼 Tăng ổn định",
    note: "Đơn hàng lễ hội",
  },
  {
    month: "2024-11",
    totalBatches: 28,
    cancelledBatches: 0,
    changePercent: "+12%",
    alertStatus: "🔼 Tăng nhẹ",
    note: "Đơn hàng cuối năm",
  },
  {
    month: "2024-12",
    totalBatches: 30,
    cancelledBatches: 1,
    changePercent: "+7%",
    alertStatus: "🔼 Tăng nhẹ",
    note: "Giáp Tết",
  },
  {
    month: "2025-01",
    totalBatches: 32,
    cancelledBatches: 2,
    changePercent: "+6%",
    alertStatus: "🔼 Tăng nhẹ",
    note: "Bắt đầu năm mới",
  },
  {
    month: "2025-02",
    totalBatches: 18,
    cancelledBatches: 3,
    changePercent: "-44%",
    alertStatus: "🔻 Giảm mạnh",
    note: "Tết Nguyên Đán nghỉ dài",
  },
  {
    month: "2025-03",
    totalBatches: 24,
    cancelledBatches: 1,
    changePercent: "+33%",
    alertStatus: "🔼 Tăng mạnh",
    note: "Hoạt động trở lại",
  },
  {
    month: "2025-04",
    totalBatches: 26,
    cancelledBatches: 0,
    changePercent: "+8%",
    alertStatus: "🔼 Tăng nhẹ",
    note: "Ổn định",
  },
  {
    month: "2025-05",
    totalBatches: 29,
    cancelledBatches: 1,
    changePercent: "+11%",
    alertStatus: "🔼 Tăng ổn định",
    note: "Thêm khách hàng mới",
  },
  {
    month: "2025-06",
    totalBatches: 27,
    cancelledBatches: 2,
    changePercent: "-6%",
    alertStatus: "🔻 Giảm nhẹ",
    note: "Bảo trì dây chuyền",
  },
  {
    month: "2025-07",
    totalBatches: 31,
    cancelledBatches: 1,
    changePercent: "+14%",
    alertStatus: "🔼 Tăng ổn định",
    note: "Đơn hàng mùa hè",
  },
  {
    month: "2025-08",
    totalBatches: 35,
    cancelledBatches: 0,
    changePercent: "+12%",
    alertStatus: "🔼 Tăng ổn định",
    note: "Sản lượng kỷ lục",
  },
];

const chartConfig = {
  totalBatches: {
    label: "Tổng số mẻ",
    color: "var(--chart-1)",
  },
  cancelledBatches: {
    label: "Tổng số mẻ bị hủy",
    color: "var(--chart-2)",
  },
  temperature: {
    label: "Nhiệt độ hiện tại",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DashboardBatchManager() {
  const [timeRange, setTimeRange] = useState("3m");
  const [chartDatas, setChartData] = useState<
    { date: string; totalBatches: number }[]
  >([]);
  const [chartTemp, setChartTemp] = useState<TemperatureLog[]>([]);
  const [tableData, setTableData] = useState<
    {
      month: string;
      totalBatches: number;
      cancelledBatches: number;
      changePercent: string; // ví dụ "+15%", "-56%", "0%"
      alertStatus: string; // ví dụ "🔼 Tăng đột biến"
      note: string;
    }[]
  >([]);

  const [currentMonthData, setCurrentMonthData] = useState({
    month: "",
    totalBatches: 0,
    cancelledBatches: 0,
    changePercent: "0%",
    alertStatus: "Bình thường",
    note: "Không có dữ liệu tháng này",
  });

  useEffect(() => {
    handleGetTotalBatchesByTimeAPI();
    hanldeGetBatchSummaryByDateRangeAPI();
  }, []);

  useEffect(() => {
    if (tableData.length > 0) {
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7); // "YYYY-MM"

      const found = tableData.find((item) => item.month === currentMonth);

      if (found) {
        setCurrentMonthData(found);
      } else {
        setCurrentMonthData({
          month: currentMonth,
          totalBatches: 0,
          cancelledBatches: 0,
          changePercent: "0%",
          alertStatus: "Bình thường",
          note: "Không có dữ liệu tháng này",
        });
      }
    }
  }, [tableData]);

  useEffect(() => {
    handleGetAllTempsAPI(); // gọi lần đầu khi component mount

    const interval = setInterval(() => {
      handleGetAllTempsAPI(); // gọi lại mỗi 5 giây
    }, 10000);

    return () => clearInterval(interval); // cleanup khi unmount
  }, []);

  const handleGetAllTempsAPI = async () => {
    const temp = await getAllTempsAPI(1);
    setChartTemp(temp.data.data);
  };

  const hanldeGetBatchSummaryByDateRangeAPI = async () => {
    const stats = await getBatchSummaryByDateRangeAPI();
    setTableData(stats.data);
  };

  const handleGetTotalBatchesByTimeAPI = async () => {
    const stats = await getTotalBatchesByTimeAPI();
    setChartData(stats.data);
  };

  const filteredData = (() => {
    let monthsToSubtract = 0;
    if (timeRange === "1y") {
      // 1 năm
      monthsToSubtract = 12;
    } else if (timeRange === "6m") {
      // 6 tháng
      monthsToSubtract = 6;
    } else if (timeRange === "3m") {
      // 3 tháng
      monthsToSubtract = 3;
    }

    const referenceDate = new Date();
    const startDate = new Date(referenceDate);
    startDate.setMonth(startDate.getMonth() - monthsToSubtract);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    return tableData.filter((item) => {
      const [yearStr, monthStr] = item.month.split("-");
      const year = Number(yearStr);
      const month = Number(monthStr);
      if (isNaN(year) || isNaN(month)) return false;
      const itemDate = new Date(year, month - 1, 1);
      return itemDate >= startDate;
    });
  })();

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-2 mt-2">
        <p className="text-3xl font-bold">Thống kê mẻ:</p>
      </div>
      <Separator className="my-3" />
      <div className="grid-cols-1">
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-3">
          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Nhiệt độ trung bình
              </CardTitle>
              <CardDescription>
                Thống kê nhiệt độ trung bình theo thời gian thực
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart data={chartTemp}>
                  <defs>
                    <linearGradient
                      id="fillTotalTemps"
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
                    dataKey="timestamp"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const timestamp = new Date(value);
                      return timestamp.toLocaleDateString("en-US", {
                        month: "short",
                      });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            day: "numeric",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="var(--chart-1)"
                    fill="url(#fillTotalTemps)"
                    connectNulls
                    isAnimationActive={false}
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

          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Áp xuất trung bình
              </CardTitle>
              <CardDescription>
                Thống kê áp xuất trung bình theo thời gian thực
              </CardDescription>
              <CardAction></CardAction>
            </CardHeader>
            <CardContent></CardContent>
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

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold">pH hiện tại</CardTitle>
              <CardDescription>
                Thống kê độ pH trung bình theo thời gian thực
              </CardDescription>
              <CardAction></CardAction>
            </CardHeader>
            <CardContent>
              <div></div>
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
        <div className="pt-3 grid-cols-1">
          <Card className="w-full ">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle className="text-lg font-bold">
                  Thống kê thời gian thực
                </CardTitle>
                <CardDescription>
                  Showing total visitors for the last 3 months
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
                  <SelectItem value="3m" className="rounded-lg">
                    3 tháng trước
                  </SelectItem>
                  <SelectItem value="6m" className="rounded-lg">
                    6 tháng trước
                  </SelectItem>
                  <SelectItem value="1y" className="rounded-lg">
                    1 năm trước
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
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
                    <linearGradient
                      id="fillCancelledBatches"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const month = new Date(value);
                      return month.toLocaleDateString("en-US", {
                        month: "short", // "Jan", "Feb", ...
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
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="totalBatches"
                    stroke="var(--chart-1)"
                    fill="url(#fillTotalBatches)"
                    connectNulls
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="cancelledBatches"
                    stroke="var(--chart-2)"
                    fill="url(#fillCancelledBatches)"
                    connectNulls
                    isAnimationActive={false}
                  />

                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <div>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 leading-none font-medium">
                      {/* Trending up by 5.2% this month
                      <TrendingUp className="h-4 w-4" /> */}
                      {currentMonthData.alertStatus}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 leading-none m-auto">
                      {currentMonthData.month}
                    </div>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="pt-3 grid-cols-1">
          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Cánh báo - lịch sử dữ liệu
              </CardTitle>
              <CardDescription>
                Thống kê lịch sử mẻ đã được tạo và phần trăm tăng trưởng theo
                tháng trong năm
              </CardDescription>
              <CardAction></CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  Danh sách thống kê sự tăng giảm của mẻ sản xuất 12 tháng trong
                  năm
                </TableCaption>
                <TableHeader className="bg-gray-100 text-gray-800">
                  <TableRow>
                    <TableHead>Ngày / Tháng</TableHead>
                    <TableHead>Tổng số mẻ</TableHead>
                    <TableHead>Tổng số mẻ bị hủy</TableHead>
                    <TableHead>Mức thay đổi (%)</TableHead>
                    <TableHead>Trạng thái cảnh báo</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell className="font-medium">
                        <strong>{item.month}</strong>
                      </TableCell>
                      <TableCell>{item.totalBatches}</TableCell>
                      <TableCell>{item.cancelledBatches}</TableCell>
                      <TableCell>{item.changePercent}</TableCell>
                      <TableCell>{item.alertStatus}</TableCell>
                      <TableCell>{item.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex-col gap-2"></CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
