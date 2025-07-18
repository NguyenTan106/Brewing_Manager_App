import { Button, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import type { Recipe, RecipeIngredient } from "../../services/CRUD_API_Recipe";
import { useEffect, useState } from "react";
import AddNewRecipeModal from "./AddNewRecipeModal";
import {
  getAllIngredientsAPI,
  type Ingredient,
} from "../../services/CRUD_API_Ingredient";
import {
  getAllRecipesAPI,
  getRecipeByIdAPI,
} from "../../services/CRUD_API_Recipe";
import RecipeDetailModal from "./RecipeDetailModal";
export default function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecipeIngredient, setSelectedRecipeIngredient] = useState<
    RecipeIngredient[] | null
  >(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    handleGetAllRecipesAPI();
    handleGetAllIngredientsAPI();
  }, []);

  const handleGetAllRecipesAPI = async () => {
    const data = await getAllRecipesAPI();
    setRecipes(data);
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
        handleGetAllRecipesAPI={handleGetAllRecipesAPI}
        setSelectedRecipe={setSelectedRecipe}
        selectedRecipeIngredient={selectedRecipeIngredient}
        setSelectedRecipeIngredient={setSelectedRecipeIngredient}
      />
      <AddNewRecipeModal
        showAddModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleGetAllRecipesAPI={handleGetAllRecipesAPI}
        ingredients={ingredients}
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
    </>
  );
}
