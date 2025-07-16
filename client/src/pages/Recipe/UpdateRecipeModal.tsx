import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import type { Recipe } from "../../services/CRUD_API_Recipe";
import { updateRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  selectedRecipe: Recipe | null;
  handleGetAllRecipesAPI: () => Promise<void>;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
}

export default function UpdateRecipeModal({
  showUpdateModal,
  handleClose,
  selectedRecipe,
  setSelectedRecipe,
  handleGetAllRecipesAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Recipe>>({});

  useEffect(() => {
    if (selectedRecipe) {
      setEditForm(selectedRecipe);
    }
  }, [selectedRecipe]);
  const handleUpdateRecipeByIdAPI = async (id: number) => {
    if (!id) return;
    try {
      if (
        editForm.name === "" ||
        editForm.description === "" ||
        editForm.note === "" ||
        editForm.instructions === ""
      ) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      if (
        selectedRecipe?.name == editForm.name &&
        selectedRecipe?.description == editForm.description &&
        selectedRecipe?.instructions == editForm.instructions &&
        selectedRecipe?.note == editForm.note
      ) {
        alert("Không có thay đổi nào để cập nhật");
        return;
      }
      const data = await updateRecipeByIdAPI(id, editForm);
      handleClose();
      handleGetAllRecipesAPI();
      setSelectedRecipe(data.data);
    } catch (err) {
      console.error("Lỗi khi cập nhật mẻ:", err);
      alert("Lỗi khi cập nhật mẻ");
    }
  };
  return (
    <>
      <Modal show={showUpdateModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sửa nguyên liệu {selectedRecipe?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              <strong>ID:</strong> {selectedRecipe?.id}
            </p>
            <div>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Tên công thức:</strong>
                </Form.Label>
                <Form.Control
                  placeholder="VD: Crystal 60L"
                  value={editForm?.name ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="volume" className="mb-3">
                <Form.Label>
                  <strong>Mô tả:</strong>
                </Form.Label>
                <Form.Control
                  placeholder="VD: g"
                  value={editForm?.description ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="notes" className="mb-3">
                <Form.Label>
                  <strong>Ghi chú:</strong>
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={4}
                  placeholder="VD: 20"
                  value={editForm?.note ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      note: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Các bước thực hiện:</strong>
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={4}
                  placeholder="VD: 20"
                  value={editForm?.instructions ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      instructions: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className=""
            variant="success"
            onClick={() =>
              selectedRecipe?.id &&
              handleUpdateRecipeByIdAPI(selectedRecipe?.id)
            }
            style={{
              padding: "5px 10px",
            }}
          >
            ✏️ <span className="d-none d-sm-inline">Cập nhật</span>
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
