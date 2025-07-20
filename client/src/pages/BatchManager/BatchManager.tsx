import { Button, Table, Badge } from "react-bootstrap";
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
        return <Badge bg="primary">Đun sôi</Badge>;
      case Status.fermenting:
        return <Badge bg="warning">Lên men</Badge>;
      case Status.cold_crashing:
        return <Badge bg="info">Làm lạnh</Badge>;
      case Status.done:
        return <Badge bg="success">Hoàn thành</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
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

      <div className="d-flex justify-content-start align-items-center mt-3 flex-wrap gap-2">
        <h3 className="mb-0">Danh sách mẻ:</h3>
        <Button
          title="Thêm nguyên liệu mới"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaPlus />
          <span className="d-none d-sm-inline">Thêm</span>
        </Button>
      </div>

      <hr />
      <Table
        striped
        bordered
        hover
        responsive
        style={{ verticalAlign: "middle", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th style={{ width: "5%" }}>Mã mẻ</th>
            <th style={{ width: "10%" }}>Tên mẻ</th>
            <th style={{ width: "8%" }}>Trạng thái</th>
            <th style={{ width: "10%" }}>Khối lượng (lít)</th>
            <th style={{ width: "10%" }}>Công thức</th>
            <th style={{ width: "10%" }}>Ngày tạo</th>
            <th style={{ width: "10%" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {batches.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                Không có mẻ nào
              </td>
            </tr>
          ) : (
            batches.map((i) => (
              <tr key={i.id}>
                <td>{i.code}</td>
                <td>{i.beerName}</td>
                <td>{getStatusBadge(i.status)}</td>
                <td>{i.volume}</td>
                <td>{i.recipe?.name || "Chưa có công thức nào"}</td>
                <td>
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
                </td>

                <td>
                  <Button
                    title="Xem chi tiết nguyên liệu"
                    variant="info"
                    onClick={() => handleGetBatchesByIdAPI(i.id)}
                    style={{ padding: "5px 10px", fontSize: "14px" }}
                  >
                    📋 <span className="d-none d-sm-inline">Chi tiết</span>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mt-4">
          <Button
            variant="outline-secondary"
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
                  variant={
                    pageNum === currentPage ? "secondary" : "outline-secondary"
                  }
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
                <span
                  key={pageNum}
                  className="text-secondary mx-2"
                  style={{ fontWeight: "bold" }}
                >
                  ...
                </span>
              );
            }
            return null;
          })}
          <Button
            variant="outline-secondary"
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
