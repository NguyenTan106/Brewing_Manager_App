import { Modal, Button, Table } from "react-bootstrap";
import type {
  RecipeIngredient,
  RecipeUpate,
} from "../../services/CRUD_API_Recipe";
import { useState } from "react";
import UpdateRecipeModal from "./UpdateRecipeModal";
import { deleteRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
import type { Ingredient } from "../../services/CRUD_API_Ingredient";
import IngredientDetailModalFromRecipe from "./IngredientDetailModalFromRecipe";
import { getIngredientByIdAPI } from "../../services/CRUD_API_Ingredient";
interface Props {
  handleClose: () => void;
  showDetailModal: boolean;
  selectedRecipe: RecipeUpate | null;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<RecipeUpate | null>>;
  selectedRecipeIngredient: RecipeIngredient[] | null;
  setSelectedRecipeIngredient: React.Dispatch<
    React.SetStateAction<RecipeIngredient[] | null>
  >;
  ingredients: Ingredient[];
  handlePaginationAPI: () => void;
}

export default function RecipeDetailModal({
  handleClose,
  showDetailModal,
  selectedRecipe,
  setSelectedRecipe,
  selectedRecipeIngredient,
  setSelectedRecipeIngredient,
  handlePaginationAPI,
  ingredients,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailIngredientModal, setShowDetailIngredientModal] =
    useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const handleDeleteRecipeByIdAPI = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công thức này?")) {
      const deleted = await deleteRecipeByIdAPI(id);
      console.log(deleted);
      const errorMessage = deleted.message;
      if (deleted.data == null) {
        alert(`${errorMessage}`);
        return;
      }
      alert(`${errorMessage}`);
      handlePaginationAPI();
      handleClose();
    }
  };

  const handleGetIngredientByIdAPI = async (id: number) => {
    const ingredient = await getIngredientByIdAPI(id);
    setSelectedIngredient(ingredient);
    setShowDetailIngredientModal(true);
  };

  return (
    <>
      <IngredientDetailModalFromRecipe
        showDetailIngredientModal={showDetailIngredientModal}
        handleClose={() => setShowDetailIngredientModal(false)}
        selectedIngredient={selectedIngredient as Ingredient}
      />
      <UpdateRecipeModal
        selectedRecipe={selectedRecipe}
        handleClose={() => {
          setShowUpdateModal(false);
        }}
        showUpdateModal={showUpdateModal}
        handlePaginationAPI={handlePaginationAPI}
        setSelectedRecipe={setSelectedRecipe}
        selectedRecipeIngredient={selectedRecipeIngredient}
        setSelectedRecipeIngredient={setSelectedRecipeIngredient}
        ingredients={ingredients}
      />
      <Modal show={showDetailModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết công thức</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              <strong>ID:</strong> {selectedRecipe?.id}
            </p>
            <p>
              <strong>Tên công thức:</strong> {selectedRecipe?.name}
            </p>
            <p>
              <strong>Mô tả:</strong> {selectedRecipe?.description}
            </p>
            <strong>Nguyên liệu cần dùng:</strong>
            <div></div>
            <Table>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>ID</th>
                  <th style={{ width: "20%" }}>Tên</th>
                  <th style={{ width: "20%" }}>Số lượng cần</th>
                  <th style={{ width: "20%" }}>Loại</th>
                  <th style={{ width: "15%" }}></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedRecipeIngredient) &&
                selectedRecipeIngredient.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      <p>Không có nguyên liệu</p>
                    </td>
                  </tr>
                ) : (
                  selectedRecipeIngredient?.map((e) => (
                    <tr className="align-middle" key={e.ingredient.id}>
                      <td>{e.ingredient.id}</td>
                      <td>{e.ingredient.name}</td>
                      <td>
                        {e.amountNeeded}
                        {e.ingredient.unit} / 60L
                      </td>
                      <td>{e.ingredient.type}</td>
                      <td>
                        <Button
                          title="Xem chi tiết nguyên liệu"
                          variant="info"
                          onClick={() =>
                            handleGetIngredientByIdAPI(e.ingredient.id)
                          }
                          style={{ padding: "5px 10px", fontSize: "14px" }}
                        >
                          📋{" "}
                          <span className="d-none d-sm-inline">Chi tiết</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <p>
              <strong>Ghi chú: </strong>
              {selectedRecipe?.note}
            </p>
            <p>
              <strong>Các bước thực hiện: </strong>
              {selectedRecipe?.instructions}
            </p>
            <p>
              <strong>Ngày tạo: </strong>
              {selectedRecipe?.createdAt &&
                new Date(selectedRecipe.createdAt).toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                  hour12: false,
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
            <div className="mt-2">
              <Button
                className=""
                variant="success"
                onClick={() => setShowUpdateModal(true)}
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                }}
              >
                ✏️ <span className="d-none d-sm-inline">Chỉnh sửa</span>
              </Button>
              <Button
                className="m-2"
                variant="danger"
                onClick={() =>
                  selectedRecipe?.id &&
                  handleDeleteRecipeByIdAPI(selectedRecipe?.id)
                }
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                }}
              >
                🗑️ <span className="d-none d-sm-inline">Xóa</span>
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
