import { Modal, Button, Table } from "react-bootstrap";
import type { Recipe, RecipeIngredient } from "../../services/CRUD_API_Recipe";
import { useState } from "react";
import UpdateRecipeModal from "./UpdateRecipeModal";
import { deleteRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
// import { getIngredientByIdAPI } from "../../services/CRUD_API_Ingredient";
interface Props {
  handleClose: () => void;
  showDetailModal: boolean;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
  handleGetAllRecipesAPI: () => Promise<void>;
  selectedRecipeIngredient: RecipeIngredient[] | null;
  setSelectedRecipeIngredient: React.Dispatch<
    React.SetStateAction<RecipeIngredient[] | null>
  >;
}

export default function RecipeDetailModal({
  handleClose,
  showDetailModal,
  selectedRecipe,
  setSelectedRecipe,
  handleGetAllRecipesAPI,
  selectedRecipeIngredient,
  setSelectedRecipeIngredient,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [showIngredientDetailModal, setShowIngredientDetailModal] =
  //   useState(false);
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
      //   handlePaginationAPI();
      await handleGetAllRecipesAPI();
      handleClose();
    }
  };

  return (
    <>
      <UpdateRecipeModal
        selectedRecipe={selectedRecipe}
        handleClose={() => {
          setShowUpdateModal(false);
        }}
        showUpdateModal={showUpdateModal}
        handleGetAllRecipesAPI={handleGetAllRecipesAPI}
        setSelectedRecipe={setSelectedRecipe}
        selectedRecipeIngredient={selectedRecipeIngredient}
        setSelectedRecipeIngredient={setSelectedRecipeIngredient}
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
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Số lượng cần</th>
                  <th>Đơn vị</th>
                  <th>Hành động</th>
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
                    <tr>
                      <td>{e.ingredient.id}</td>
                      <td>{e.ingredient.name}</td>
                      <td>{e.amountNeeded}</td>
                      <td>{e.ingredient.unit}</td>
                      <td>
                        <Button
                          title="Xem chi tiết nguyên liệu"
                          variant="info"
                          // onClick={() => handleGetRecipeByIdAPI(i.id)}
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
