import { useState, useEffect } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import {
  getAllIngredientsAPI,
  getIngredientByIdAPI,
} from "../../services/CRUD_API_Ingredient";
import IngredientDetailModal from "./IngredientDetailModal";
import { getIngredientIcon } from "./IngredientIcon";
import { AddIngredient } from "./AddNewIngredient";
import { paginationIngredientAPI } from "../../services/pagination_API";
import { FaAngleRight, FaAngleLeft, FaPlus } from "react-icons/fa";
import { type Ingredient } from "../../services/CRUD_API_Ingredient";

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // ✅ flag
  useEffect(() => {
    const savedPage = localStorage.getItem("ingredient_page");
    const savedLimit = localStorage.getItem("ingredient_limit");

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedLimit) setLimit(Number(savedLimit));

    setIsInitialized(true); // ✅ cho phép gọi API sau khi đọc xong localStorage
  }, []);

  // 🔁 Gọi API chỉ khi dữ liệu khởi tạo xong
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("ingredient_page", currentPage.toString());
      localStorage.setItem("ingredient_limit", limit.toString());

      handlePaginationAPI(currentPage, limit);
    }
  }, [currentPage, limit, isInitialized]);

  const handlePaginationAPI = async (page: number, limit: number) => {
    const data = await paginationIngredientAPI(page, limit);
    // Nếu không có dữ liệu và không phải trang đầu → quay về trang trước
    if (data.data.length === 0 && page > 1) {
      setCurrentPage(page - 1);
      return;
    }
    setIngredients(data.data);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // useEffect sẽ tự gọi handlePaginationAPI
    }
  };

  const handleGetAllIngredientsAPI = async () => {
    const data = await getAllIngredientsAPI();
    setIngredients(data);
  };

  const handleGetIngredientByIdAPI = async (id: number) => {
    const data = await getIngredientByIdAPI(id);
    setSelectedIngredient(data);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="d-flex justify-content-start align-items-center mt-3 flex-wrap gap-2">
        <h3 className="mb-0">Kho nguyên liệu:</h3>
        <Button
          title="Thêm nguyên liệu mới"
          variant="primary"
          onClick={() => setShowAddIngredientModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaPlus />
          <span className="d-none d-sm-inline">Thêm</span>
        </Button>
      </div>

      <AddIngredient
        handleGetAllIngredientsAPI={handleGetAllIngredientsAPI}
        showAddIngredientModal={showAddIngredientModal}
        handleClose={() => setShowAddIngredientModal(false)}
      />

      <IngredientDetailModal
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        handleClose={() => setShowDetailModal(false)}
        selectedIngredient={selectedIngredient}
        getIngredientIcon={getIngredientIcon}
        handleGetAllIngredientsAPI={handleGetAllIngredientsAPI}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
      />
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
            <th style={{ width: "5%" }}>ID</th>
            <th style={{ width: "15%" }}>Tên nguyên liệu</th>
            <th style={{ width: "10%" }}>Loại</th>
            <th style={{ width: "12%" }}>Số lượng tồn</th>
            <th style={{ width: "8%" }}>Đơn vị</th>
            <th style={{ width: "10%" }}>Trạng thái</th>
            <th style={{ width: "20%" }}>Ngày nhập kho gần nhất</th>
            <th style={{ width: "15%" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                Không có nguyên liệu nào
              </td>
            </tr>
          ) : (
            ingredients.map((i, idx) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>
                  {getIngredientIcon(i.type)}
                  {i.type}
                </td>
                <td>{i.quantity}</td>
                <td>{i.unit}</td>
                <td>
                  {i.status === "Đủ" && (
                    <Badge bg="success" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                  {i.status === "Sắp hết" && (
                    <Badge bg="warning" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                  {i.status === "Hết" && (
                    <Badge bg="danger" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                </td>
                <td>
                  {i.lastImportDate &&
                    new Date(i.lastImportDate).toLocaleString("vi-VN", {
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
                    onClick={() => handleGetIngredientByIdAPI(i.id)}
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
