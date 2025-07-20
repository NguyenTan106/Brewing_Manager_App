import { Button, Table } from "react-bootstrap";
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

      <div className="d-flex justify-content-start align-items-center mt-3 flex-wrap gap-2">
        <h3 className="mb-0">Danh sách công thức:</h3>
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
            <th style={{ width: "5%" }}>ID</th>
            <th style={{ width: "10%" }}>Tên công thức</th>
            <th style={{ width: "8%" }}>Mô tả</th>
            <th style={{ width: "10%" }}>Ghi chú</th>
            <th style={{ width: "10%" }}>Các bước thực hiện</th>
            <th style={{ width: "10%" }}>Ngày tạo</th>
            <th style={{ width: "10%" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {recipes.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                Không có công thức nào
              </td>
            </tr>
          ) : (
            recipes.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.description}</td>
                <td>{i.note}</td>
                <td>{i.instructions}</td>
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
                    onClick={() => handleGetRecipeByIdAPI(i.id)}
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
