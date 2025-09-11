import {
  getAllBatchesAPI,
  getBatchByIdAPI,
} from "../../services/CRUD/CRUD_API_Batch";
import { useState, useEffect, useRef } from "react";
import { FaAngleRight, FaAngleLeft, FaPlus } from "react-icons/fa";
import BatchDetailModal from "./BatchDetailModal";
import AddNewBatchModal from "./AddNewBatchModal";
import { paginationBatchAPI } from "../../services/pagination_API";
import { type Batch } from "../../services/CRUD/CRUD_API_Batch";
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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { searchBatchAPI } from "@/services/search_API";
export default function BatchManager() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const firstLoad = useRef(true);

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

      const fetchData = () => {
        handlePaginationAPI(currentPage, limit);
      };

      fetchData(); // Gọi lần đầu tiên khi effect
      const interval = setInterval(fetchData, 1000); // Gọi lại mỗi 10 giây

      return () => clearInterval(interval); // Xóa interval khi unmount hoặc dependency thay đổi
    }
  }, [currentPage, limit, isInitialized]);

  useEffect(() => {
    if (selectedBatch?.id != null) {
      const item = batches.find((e) => e.id === selectedBatch.id);
      if (item && JSON.stringify(item) !== JSON.stringify(selectedBatch)) {
        setSelectedBatch(item);
      }
    }
  }, [batches]);

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
    const data = await getBatchByIdAPI(id);
    setSelectedBatch(data);
    setShowDetailModal(true);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (firstLoad.current) {
        firstLoad.current = false;
        return; // ❌ Bỏ qua lần đầu
      }

      if (searchItem.trim() !== "") {
        handleSearchRecipeAPI(searchItem);
      } else {
        handlePaginationAPI(currentPage, limit); // ✅ Chỉ gọi khi người dùng xóa truy vấn
      }
    }, 100); // bạn có thể để 300ms cho mượt

    return () => clearTimeout(delayDebounce);
  }, [searchItem, currentPage, limit]);

  const handleSearchRecipeAPI = async (query: string) => {
    try {
      const res = await searchBatchAPI(query);
      setBatches(res);
    } catch (err) {
      console.log("Lỗi tìm kiếm", err);
      toast.error("Lỗi tìm kiếm");
    }
  };

  return (
    <>
      <BatchDetailModal
        showDetailModal={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        handleGetAllBatchesAPI={handleGetAllBatchesAPI}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
      />

      <AddNewBatchModal
        showAddModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
      />

      {/* <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <div className="grid grid-col-1 sm:grid-cols-2 gap-4 ">
          <p className="text-3xl font-bold">Danh sách mẻ: </p>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-9"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          title="Thêm nguyên liệu mới"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition"
        >
          <FaPlus />
          <span className="hidden sm:inline">Thêm</span>
        </Button>
      </div> */}

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
          Danh sách mẻ:
        </p>

        <div className="relative w-full sm:w-72 flex gap-3">
          <div>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-9"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            title="Thêm nguyên liệu mới"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition"
          >
            <FaPlus />
            <span className="hidden sm:inline">Thêm</span>
          </Button>
        </div>
      </div>

      <Separator className="my-2" />
      <div className="bg-white text-base rounded-2xl shadow-md border border-gray-200 overflow-hidden my-3">
        <Table className="table-auto w-full text-base ">
          <TableHeader className="bg-gray-100 text-gray-800">
            <TableRow>
              <TableHead className="px-4 py-3 text-left">Mã mẻ</TableHead>
              <TableHead className="px-4 py-3 text-left">Tên mẻ</TableHead>
              <TableHead className="px-4 py-3 text-left">Trạng thái</TableHead>
              <TableHead className="px-4 py-3 text-left">
                Thể tích (lít)
              </TableHead>
              <TableHead className="px-4 py-3 text-left">Công thức</TableHead>
              <TableHead className="px-4 py-3 text-left hidden 2xl:table-cell">
                Ngày tạo
              </TableHead>
              <TableHead className="px-4 py-3 text-left">Người tạo</TableHead>
              <TableHead className="px-4 py-3 text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {batches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foregroundd"
                >
                  Không có mẻ nào
                </TableCell>
              </TableRow>
            ) : (
              batches.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="px-4 py-3">{i.code}</TableCell>
                  <TableCell className="px-4 py-3">{i.beerName}</TableCell>
                  <TableCell className="px-4 py-3">{i.status}</TableCell>
                  <TableCell className="px-4 py-3">{i.volume}</TableCell>
                  <TableCell className="px-4 py-3">
                    {i.recipe?.name || "Chưa có công thức nào"}
                  </TableCell>
                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
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
                  <TableCell className="px-4 py-3">
                    {i.createdBy?.username}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      title="Xem chi tiết nguyên liệu"
                      variant="outline"
                      onClick={() => handleGetBatchesByIdAPI(i.id)}
                      style={{ padding: "5px 10px", fontSize: "14px" }}
                    >
                      📋 <span className="hidden sm:inline">Chi tiết</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-center text-sm text-gray-500  mt-5">
        - - - Danh sách mẻ - - -
      </div>
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
