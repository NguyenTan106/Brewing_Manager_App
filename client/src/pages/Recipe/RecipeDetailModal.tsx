import { Modal, Button } from "react-bootstrap";
import type { Recipe } from "../../services/CRUD_API_Recipe";
import { useState } from "react";
import UpdateRecipeModal from "./UpdateRecipeModal";
import { deleteRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
interface Props {
  handleClose: () => void;
  showDetailModal: boolean;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
  handleGetAllRecipesAPI: () => Promise<void>;
}

export default function RecipeDetailModal({
  handleClose,
  showDetailModal,
  selectedRecipe,
  setSelectedRecipe,
  handleGetAllRecipesAPI,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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
        handleClose={() => setShowUpdateModal(false)}
        showUpdateModal={showUpdateModal}
        handleGetAllRecipesAPI={handleGetAllRecipesAPI}
        setSelectedRecipe={setSelectedRecipe}
      />
      <Modal show={showDetailModal} onHide={handleClose} centered>
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
                ✏️ <span className="d-none d-sm-inline">Cập nhật</span>
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
