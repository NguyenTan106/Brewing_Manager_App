import { useState, useEffect } from "react";
import { Modal, Form, Button, Table } from "react-bootstrap";
import type { Recipe } from "../../services/CRUD_API_Recipe";
import { updateRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
import { type RecipeIngredient } from "../../services/CRUD_API_Recipe";

interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  selectedRecipe: Recipe | null;
  handleGetAllRecipesAPI: () => Promise<void>;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
  selectedRecipeIngredient: RecipeIngredient[] | null;
  setSelectedRecipeIngredient: React.Dispatch<
    React.SetStateAction<RecipeIngredient[] | null>
  >;
}

export default function UpdateRecipeModal({
  showUpdateModal,
  handleClose,
  selectedRecipe,
  setSelectedRecipe,
  handleGetAllRecipesAPI,
  selectedRecipeIngredient,
  setSelectedRecipeIngredient,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Recipe>>({});

  useEffect(() => {
    if (selectedRecipe) {
      setEditForm(selectedRecipe);
    }
  }, [selectedRecipe]);

  useEffect(() => {
    if (showUpdateModal && selectedRecipe && selectedRecipeIngredient) {
      setEditForm({
        name: selectedRecipe.name || "",
        description: selectedRecipe.description || "",
        note: selectedRecipe.note || "",
        instructions: selectedRecipe.instructions || "",
        recipeIngredients: selectedRecipeIngredient.map((ri) => ({
          id: ri.id,
          ingredient: ri.ingredient,
          ingredientId: ri.ingredient.id,
          amountNeeded: ri.amountNeeded,
        })),
      });
    }
  }, [showUpdateModal, selectedRecipe, selectedRecipeIngredient]);
  const handleUpdateRecipeByIdAPI = async (id: number) => {
    if (!id) return;
    try {
      if (
        editForm.name === "" ||
        !editForm.recipeIngredients ||
        (Array.isArray(editForm.recipeIngredients) &&
          editForm.recipeIngredients.length === 0) ||
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
        selectedRecipe?.note == editForm.note &&
        JSON.stringify(selectedRecipe?.recipeIngredients) ===
          JSON.stringify(editForm.recipeIngredients)
      ) {
        alert("Không có thay đổi nào để cập nhật");
        return;
      }
      const data = await updateRecipeByIdAPI(id, editForm);
      console.log(data);
      handleClose();
      handleGetAllRecipesAPI();
      setSelectedRecipe(data.data);
      setSelectedRecipeIngredient(data.data.recipeIngredients);
    } catch (err) {
      console.error("Lỗi khi cập nhật mẻ:", err);
      alert("Lỗi khi cập nhật mẻ");
    }
  };

  return (
    <>
      <Modal show={showUpdateModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Sửa công thức {selectedRecipe?.name}</Modal.Title>
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
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Nguyên liệu cần dùng:</strong>
                </Form.Label>
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
                        <tr key={e.ingredient.id}>
                          <td>{e.ingredient.id}</td>
                          <td>{e.ingredient.name}</td>
                          <td>
                            <Form.Control
                              type="number"
                              value={
                                editForm.recipeIngredients?.find(
                                  (ri) => ri.ingredientId === e.ingredient.id
                                )?.amountNeeded ?? ""
                              }
                              onChange={(event) => {
                                const newAmount = event.target.value;

                                setEditForm((prev) => ({
                                  ...prev,
                                  recipeIngredients: (
                                    prev.recipeIngredients ?? []
                                  ).map((ri) =>
                                    ri.ingredientId === e.ingredient.id
                                      ? { ...ri, amountNeeded: newAmount }
                                      : ri
                                  ),
                                }));
                              }}
                            />
                          </td>
                          <td>{e.ingredient.unit}</td>
                          <td>
                            <Button
                              title="Xem chi tiết nguyên liệu"
                              variant="info"
                              style={{ padding: "5px 10px", fontSize: "14px" }}
                            >
                              📋{" "}
                              <span className="d-none d-sm-inline">
                                Chi tiết
                              </span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
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
