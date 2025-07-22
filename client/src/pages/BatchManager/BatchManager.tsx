import {
  getAllBatchesAPI,
  getAllBatchByIdAPI,
} from "../../services/CRUD_API_Batch";
import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft, FaPlus } from "react-icons/fa";
import BatchDetailModal from "./BatchDetailModal";
import AddNewBatchModal from "./AddNewBatchModal";
import { paginationBatchAPI } from "../../services/pagination_API";
import {
  type Batch,
  statusLabelMap,
  Status,
} from "../../services/CRUD_API_Batch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BatchManager() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const statusOptions: { label: string; value: Status }[] = Object.entries(
    statusLabelMap
  ).map(([key, label]) => ({
    label,
    value: key as Status,
  }));

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.boiling:
        return <Badge variant="outline">Nấu sôi</Badge>;
      case Status.fermenting:
        return <Badge variant="outline">Lên men</Badge>;
      case Status.cold_crashing:
        return <Badge variant="outline">Làm lạnh</Badge>;
      case Status.done:
        return <Badge variant="outline">Hoàn tất</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const [usedIngredients, setUsedIngredients] = useState<[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // ✅

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
    const data = await paginationBatchAPI(page, limit);

    // Nếu không có dữ liệu và không phải trang đầu → quay về trang trước
    if (data.data.length === 0 && page > 1) {
      setCurrentPage(page - 1);
      return;
    }
    setBatches(data.data);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // useEffect sẽ tự gọi handlePaginationAPI
    }
  };

  const handleGetAllBatchesAPI = async () => {
    const data = await getAllBatchesAPI();
    setBatches(data);
  };

  const handleGetBatchesByIdAPI = async (id: number) => {
    const data = await getAllBatchByIdAPI(id);
    const defaultVolume = 60;
    const amountNeeded = data.recipe.recipeIngredients.map((e: any) => {
      const volume = data.volume;
      const scaleRatio = parseFloat(volume) / defaultVolume;
      const amountToUse = scaleRatio * e.amountNeeded;
      return amountToUse;
    });
    setUsedIngredients(amountNeeded);
    // console.log(amountNeeded);
    setSelectedBatch(data);
    setShowDetailModal(true);
  };

  return (
    <>
      <BatchDetailModal
        showDetailModal={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        getStatusBadge={getStatusBadge}
        handleGetAllBatchesAPI={handleGetAllBatchesAPI}
        statusOptions={statusOptions}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
        usedIngredients={usedIngredients}
      />

      <AddNewBatchModal
        showAddModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        statusOptions={statusOptions}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
      />

      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <p className="text-2xl font-bold">Danh sách mẻ: </p>
        <Button
          onClick={() => setShowAddModal(true)}
          title="Thêm nguyên liệu mới"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition"
        >
          <FaPlus />
          <span className="hidden sm:inline">Thêm</span>
        </Button>
      </div>

      <Separator className="my-2" />
      <Table className="text-base">
        <TableCaption>- - - Danh sách mẻ - - -</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Mã mẻ</TableHead>
            <TableHead>Tên mẻ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Khối lượng (lít)</TableHead>
            <TableHead>Công thức</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted">
                Không có mẻ nào
              </TableCell>
            </TableRow>
          ) : (
            batches.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.code}</TableCell>
                <TableCell>{i.beerName}</TableCell>
                <TableCell>{getStatusBadge(i.status)}</TableCell>
                <TableCell>{i.volume}</TableCell>
                <TableCell>
                  {i.recipe?.name || "Chưa có công thức nào"}
                </TableCell>
                <TableCell>
                  {i.createdAt &&
                    new Date(i.createdAt).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </TableCell>

                <TableCell>
                  <Button
                    title="Xem chi tiết nguyên liệu"
                    variant="outline"
                    onClick={() => handleGetBatchesByIdAPI(i.id)}
                    style={{ padding: "5px 10px", fontSize: "14px" }}
                  >
                    📋 <span className="d-none d-sm-inline">Chi tiết</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex justify-center flex-wrap gap-2 mt-4">
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
