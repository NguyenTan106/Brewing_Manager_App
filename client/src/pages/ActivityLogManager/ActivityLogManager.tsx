import { useEffect, useState } from "react";
import type { ActivityLog } from "../../services/CRUD_API_ActivityLog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { paginationActivityLogAPI } from "@/services/pagination_API";
import ActivityLogDetailModal from "./ActivityLogDetailModal";
import { getActivityLogByIdAPI } from "../../services/CRUD_API_ActivityLog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
export default function ActivityLogManager() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedActivityLog, setSelectedActivityLog] =
    useState<ActivityLog | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // ✅
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const savedPage = localStorage.getItem("batch_page");
    const savedLimit = localStorage.getItem("batch_limit");

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedLimit) setLimit(Number(savedLimit));

    setIsInitialized(true); // ✅ cho phép gọi API sau khi đọc xong localStorage
  }, []);

  // 🔁 Gọi API chỉ khi dữ liệu khởi tạo xong
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("batch_page", currentPage.toString());
      localStorage.setItem("batch_limit", limit.toString());

      handlePaginationAPI(currentPage, limit);
    }
  }, [currentPage, limit, isInitialized]);

  const handlePaginationAPI = async (page: number, limit: number) => {
    const data = await paginationActivityLogAPI(page, limit);

    // Nếu không có dữ liệu và không phải trang đầu → quay về trang trước
    if (data.data.length === 0 && page > 1) {
      setCurrentPage(page - 1);
      return;
    }
    setActivityLogs(data.data);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // useEffect sẽ tự gọi handlePaginationAPI
    }
  };

  // const handleGetAllActitivyLogsAPI = async () => {
  //   const data = await getAllActivityLogsAPI();
  //   setActivityLogs(data);
  // };

  const handleGetActivityLogByIdAPI = async (id: number) => {
    const activity = await getActivityLogByIdAPI(id);
    setSelectedActivityLog(activity);
    setShowDetailModal(true);
  };

  return (
    <>
      <ActivityLogDetailModal
        showDetailModal={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        selectedActivityLog={selectedActivityLog}
      />

      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <div className="grid grid-col-1 sm:grid-cols-2 gap-4 ">
          <p className="text-2xl font-bold">Nhật kí hoạt động:</p>
          <div className="relative w-full lg:w-[150%]">
            <Search className="fixed translate-x-3 translate-y-3/5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-9"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator className="my-3" />
      <div className="bg-white text-base rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <Table className="text-base">
          <TableHeader className="bg-gray-100 text-gray-800">
            <TableRow>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "5%" }}
              >
                ID
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "5%" }}
              >
                Mã công thức
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "5%" }}
              >
                Bảng
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "5%" }}
              >
                Mô tả
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "5%" }}
              >
                Ngày thực hiện
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {activityLogs.map((e, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell className="px-4 py-3">{e.id}</TableCell>
                  <TableCell className="px-4 py-3">{e.entityId}</TableCell>
                  <TableCell className="px-4 py-3">{e.entity}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      variant={"outline"}
                      onClick={() => handleGetActivityLogByIdAPI(e.id)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {e.timestamp &&
                      new Date(e.timestamp).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour12: false,
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="text-center text-sm text-gray-500  mt-5">
        - - - Nhật kí hoạt động - - -
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center flex-wrap gap-2 mt-10">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-pill px-3 fw-semibold shadow-sm hover-shadow transition-all"
            style={{ minWidth: "80px" }}
          >
            <FaAngleLeft className="me-1" />
            Trước
          </Button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              Math.abs(currentPage - pageNum) <= 1
            ) {
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "secondary" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                  className="rounded-circle fw-semibold"
                  style={{ width: "40px", height: "40px" }}
                >
                  {pageNum}
                </Button>
              );
            } else if (
              (pageNum === currentPage - 2 && currentPage > 3) ||
              (pageNum === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return (
                <div className="mt-1">
                  <span
                    key={pageNum}
                    className=""
                    style={{ fontWeight: "bold", color: "gray" }}
                  >
                    ...
                  </span>
                </div>
              );
            }
            return null;
          })}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-pill px-3 fw-semibold shadow-sm hover-shadow transition-all"
            style={{ minWidth: "80px" }}
          >
            Sau <FaAngleRight className="ms-1" />
          </Button>
        </div>
      )}
    </>
  );
}
