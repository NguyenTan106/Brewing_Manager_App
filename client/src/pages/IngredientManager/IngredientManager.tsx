import { useState, useEffect } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import {
  getAllIngredientsAPI,
  getIngredientByIdAPI,
} from "../../services/CRUD_API_Ingredient";
import IngredientDetail from "./IngredientDetailModal";
import { getIngredientIcon } from "./IngredientIcon";
import { AddIngredient } from "./AddNewIngredient";
import { paginationAPI } from "../../services/pagination_API";
import { FaAngleRight, FaAngleLeft, FaPlus } from "react-icons/fa";
export interface Ingredient {
  id: number;
  name: string;
  type: string;
  unit: string;
  quantity: number | string;
  lowStockThreshold: number | string;
  lastImportDate: string;
  notes?: string;
  status: string;
}

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleClose = () => {
    setShowModal(false);
    setShowAddIngredientModal(false);
    setSelectedIngredient(null);
  };

  useEffect(() => {
    handlePaginationAPI(currentPage);
  }, [currentPage]);

  const handleGetAllIngredientsAPI = async () => {
    const data = await getAllIngredientsAPI();
    setIngredients(data.data);
  };

  const handleGetIngredientByIdAPI = async (id: number) => {
    const data = await getIngredientByIdAPI(id);
    setSelectedIngredient(data);
    setShowModal(true);
  };

  const handlePaginationAPI = async (page: number = 1, limit: number = 10) => {
    const data = await paginationAPI(page, limit);
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

  return (
    <>
      <div className="d-flex justify-content-start align-items-center mt-3 flex-wrap gap-2">
        <h3 className="mb-0">Danh sách nguyên liệu:</h3>
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
        handleClose={handleClose}
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
                  {new Date(i.lastImportDate).toLocaleString("vi-VN", {
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
      <IngredientDetail
        showModal={showModal}
        setShowModal={setShowModal}
        handleClose={handleClose}
        selectedIngredient={selectedIngredient}
        getIngredientIcon={getIngredientIcon}
        handleGetAllIngredientsAPI={handleGetAllIngredientsAPI}
      />
    </>
  );
}
