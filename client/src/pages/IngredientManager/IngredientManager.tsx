import { useState, useEffect } from "react";
// import { Table, Badge, Button } from "react-bootstrap";
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
    <div className="">
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

      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <p className="text-2xl font-bold">Kho nguyên liệu:</p>
        <Button
          onClick={() => setShowAddIngredientModal(true)}
          title="Thêm nguyên liệu mới"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition"
        >
          <FaPlus />
          <span className="hidden sm:inline">Thêm</span>
        </Button>
      </div>

      <Separator className="my-2" />
      <Table className="text-base ">
        <TableCaption>- - - Kho nguyên liệu - - -</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên nguyên liệu</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Số lượng tồn</TableHead>
            <TableHead>Đơn vị</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày nhập kho gần nhất</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted">
                Không có nguyên liệu nào
              </TableCell>
            </TableRow>
          ) : (
            ingredients.map((i, idx) => (
              <TableRow key={i.id}>
                <TableCell>{i.id}</TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell>
                  {getIngredientIcon(i.type)}
                  {i.type}
                </TableCell>
                <TableCell>{i.quantity}</TableCell>
                <TableCell>{i.unit}</TableCell>
                <TableCell>
                  {i.status === "Đủ" && (
                    <Badge variant="secondary" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                  {i.status === "Sắp hết" && (
                    <Badge variant="outline" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                  {i.status === "Hết" && (
                    <Badge variant="destructive" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="">
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
                </TableCell>

                <TableCell>
                  <Button
                    title="Xem chi tiết nguyên liệu"
                    variant="outline"
                    onClick={() => handleGetIngredientByIdAPI(i.id)}
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
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mt-4">
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
    </div>
  );
}
