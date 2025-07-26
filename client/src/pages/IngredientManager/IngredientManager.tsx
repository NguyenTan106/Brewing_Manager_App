import { useState, useEffect } from "react";
// import { Table, Badge, Button } from "react-bootstrap";
import {
  getAllIngredientsAPI,
  getIngredientByIdAPI,
} from "../../services/CRUD_API_Ingredient";
import IngredientDetailModal from "./IngredientDetailModal";
import { getIngredientIcon, getBadgeClass } from "./IngredientUtils";
import { AddIngredient } from "./AddNewIngredient";
import { paginationIngredientAPI } from "../../services/pagination_API";
import { FaAngleRight, FaAngleLeft, FaPlus } from "react-icons/fa";
import { type Ingredient } from "../../services/CRUD_API_Ingredient";
import { ImportIngredient } from "./ImportIngredient/ImportIngredient";
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
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [showImportIngredientModal, setShowImportIngredientModal] =
    useState(false);

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

  const handleSelectIngredientToImport = async (id: number) => {
    const data = await getIngredientByIdAPI(id);
    setSelectedIngredient(data);
    setShowImportIngredientModal(true);
  };

  return (
    <div className="">
      <ImportIngredient
        showImportIngredientModal={showImportIngredientModal}
        handleClose={() => setShowImportIngredientModal(false)}
        selectedIngredient={selectedIngredient}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
      />
      <AddIngredient
        showAddIngredientModal={showAddIngredientModal}
        handleClose={() => setShowAddIngredientModal(false)}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
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
        <div className="grid grid-col-1 sm:grid-cols-2 gap-4 ">
          <p className="text-3xl font-bold">Kho nguyên liệu:</p>
          <div className="relative w-full max-w-sm">
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
        <div className="flex flex-row gap-5">
          <Button
            onClick={() => setShowAddIngredientModal(true)}
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
              <TableHead className="px-4 py-3 text-left">ID</TableHead>
              <TableHead className="px-4 py-3 text-left">
                Tên nguyên liệu
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden 2xl:table-cell">
                Loại
              </TableHead>
              <TableHead className="px-4 py-3 text-left">
                Số lượng tồn
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Đơn vị
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Trạng thái
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden 2xl:table-cell">
                Ngày nhập kho gần nhất
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "5%" }}
              ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {ingredients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-gray-100 px-4 py-3"
                >
                  Không có nguyên liệu nào
                </TableCell>
              </TableRow>
            ) : (
              ingredients.map((i, idx) => (
                <TableRow key={i.id}>
                  <TableCell className="px-4 py-3">{i.id}</TableCell>
                  <TableCell className="px-4 py-3">{i.name}</TableCell>
                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
                    {getIngredientIcon(i.type)}
                    {i.type}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {Number(i.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    {i.unit}
                  </TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    <Badge
                      className={`me-1 ${getBadgeClass(i.status)}`}
                      key={idx}
                    >
                      {i.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
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

                  <TableCell className="px-4 py-3 flex gap-2">
                    <Button
                      title="Xem chi tiết nguyên liệu"
                      variant="outline"
                      onClick={() => handleGetIngredientByIdAPI(i.id)}
                      style={{ padding: "5px 10px", fontSize: "14px" }}
                    >
                      📋 <span className="hidden sm:inline">Chi tiết</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSelectIngredientToImport(i.id)}
                      title="Thêm nguyên liệu mới"
                      className=""
                    >
                      <FaPlus />
                      <span className="hidden sm:inline">Nhập kho</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-center text-sm text-gray-500  mt-5">
        - - - Kho nguyên liệu - - -
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
    </div>
  );
}
