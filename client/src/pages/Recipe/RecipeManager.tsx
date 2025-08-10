import type {
  Recipe,
  RecipeIngredient,
  RecipeUpate,
} from "../../services/CRUD/CRUD_API_Recipe";
import { useEffect, useRef, useState } from "react";
import AddNewRecipeModal from "./AddNewRecipeModal";
import { FaAngleRight, FaAngleLeft, FaPlus } from "react-icons/fa";
import {
  getAllIngredientsAPI,
  type Ingredient,
} from "../../services/CRUD/CRUD_API_Ingredient";
import { getRecipeByIdAPI } from "../../services/CRUD/CRUD_API_Recipe";
import RecipeDetailModal from "./RecipeDetailModal";
import { paginationRecipeAPI } from "../../services/pagination_API";
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
import { searchRecipeAPI } from "@/services/search_API";

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
  const [searchItem, setSearchItem] = useState("");
  const firstLoad = useRef(true);

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
      const res = await searchRecipeAPI(query);
      setRecipes(res);
    } catch (err) {
      console.log("Lỗi tìm kiếm", err);
      toast.error("Lỗi tìm kiếm");
    }
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

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
          Danh sách công thức:
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
                style={{ width: "10%" }}
              >
                Tên công thức
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "8%" }}
              >
                Mô tả
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "10%" }}
              >
                Ghi chú
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "10%" }}
              >
                Ngày tạo
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "10%" }}
              >
                Người tạo
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left"
                style={{ width: "10%" }}
              ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {recipes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground px-4 py-3"
                >
                  Không có công thức nào
                </TableCell>
              </TableRow>
            ) : (
              recipes.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="px-4 py-3">{i.id}</TableCell>
                  <TableCell className="px-4 py-3">{i.name}</TableCell>
                  <TableCell className="whitespace-normal break-words px-4 py-3">
                    {i.description}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words px-4 py-3">
                    {i.notes}
                  </TableCell>
                  <TableCell className="px-4 py-3">
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
                  <TableCell className="whitespace-normal break-words px-4 py-3">
                    {i.createdBy?.username}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      title="Xem chi tiết nguyên liệu"
                      variant="outline"
                      onClick={() => handleGetRecipeByIdAPI(i.id)}
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
        - - - Danh sách công thức - - -
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
