import type {
  Recipe,
  RecipeIngredient,
  RecipeUpate,
} from "../../services/CRUD_API_Recipe";
import { useEffect, useState } from "react";
import AddNewRecipeModal from "./AddNewRecipeModal";
import { FaAngleRight, FaAngleLeft, FaPlus } from "react-icons/fa";
import {
  getAllIngredientsAPI,
  type Ingredient,
} from "../../services/CRUD_API_Ingredient";
import { getRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
import RecipeDetailModal from "./RecipeDetailModal";
import { paginationRecipeAPI } from "../../services/pagination_API";
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

export default function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeUpate | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecipeIngredient, setSelectedRecipeIngredient] = useState<
    RecipeIngredient[] | null
  >(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    handleGetAllIngredientsAPI();
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // ✅

  useEffect(() => {
    const savedPage = localStorage.getItem("recipe_page");
    const savedLimit = localStorage.getItem("reicipe_limit");

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedLimit) setLimit(Number(savedLimit));

    setIsInitialized(true); // ✅ cho phép gọi API sau khi đọc xong localStorage
  }, []);

  // 🔁 Gọi API chỉ khi dữ liệu khởi tạo xong
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("recipe_page", currentPage.toString());
      localStorage.setItem("recipe_limit", limit.toString());

      handlePaginationAPI(currentPage, limit);
    }
  }, [currentPage, limit, isInitialized]);

  const handlePaginationAPI = async (page: number, limit: number) => {
    const data = await paginationRecipeAPI(page, limit);

    // Nếu không có dữ liệu và không phải trang đầu → quay về trang trước
    if (data.data.length === 0 && page > 1) {
      setCurrentPage(page - 1);
      return;
    }
    setRecipes(data.data);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // useEffect sẽ tự gọi handlePaginationAPI
    }
  };

  const handleGetRecipeByIdAPI = async (id: number) => {
    const data = await getRecipeByIdAPI(id);
    setSelectedRecipe(data);
    setSelectedRecipeIngredient(data.recipeIngredients);
    setShowDetailModal(true);
  };

  const handleGetAllIngredientsAPI = async () => {
    const data = await getAllIngredientsAPI();
    setIngredients(data);
  };

  return (
    <>
      <RecipeDetailModal
        showDetailModal={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
        selectedRecipeIngredient={selectedRecipeIngredient}
        setSelectedRecipeIngredient={setSelectedRecipeIngredient}
        ingredients={ingredients}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
      />
      <AddNewRecipeModal
        showAddModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        ingredients={ingredients}
        handlePaginationAPI={() => handlePaginationAPI(currentPage, limit)}
      />

      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <p className="text-2xl font-bold">Danh sách công thức:</p>
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
        <TableCaption>- - - Danh sách công thức - - -</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "5%" }}>ID</TableHead>
            <TableHead style={{ width: "10%" }}>Tên công thức</TableHead>
            <TableHead style={{ width: "8%" }}>Mô tả</TableHead>
            <TableHead style={{ width: "10%" }}>Ghi chú</TableHead>
            <TableHead style={{ width: "10%" }}>Ngày tạo</TableHead>
            <TableHead style={{ width: "10%" }}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted">
                Không có công thức nào
              </TableCell>
            </TableRow>
          ) : (
            recipes.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.id}</TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell className="whitespace-normal break-words">
                  {i.description}
                </TableCell>
                <TableCell className="whitespace-normal break-words">
                  {i.note}
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
                    onClick={() => handleGetRecipeByIdAPI(i.id)}
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
