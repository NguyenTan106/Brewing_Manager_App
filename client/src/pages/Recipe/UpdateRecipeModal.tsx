import { useState, useEffect } from "react";
import { Modal, Form, Button, Table } from "react-bootstrap";
import type { RecipeUpate } from "../../services/CRUD_API_Recipe";
import { updateRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
import { type RecipeIngredient } from "../../services/CRUD_API_Recipe";
import Select from "react-select";
import type { Ingredient } from "../../services/CRUD_API_Ingredient";
interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  selectedRecipe: RecipeUpate | null;
  handleGetAllRecipesAPI: () => Promise<void>;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<RecipeUpate | null>>;
  selectedRecipeIngredient: RecipeIngredient[] | null;
  setSelectedRecipeIngredient: React.Dispatch<
    React.SetStateAction<RecipeIngredient[] | null>
  >;
  ingredients: Ingredient[];
}

export default function UpdateRecipeModal({
  showUpdateModal,
  handleClose,
  selectedRecipe,
  setSelectedRecipe,
  handleGetAllRecipesAPI,
  selectedRecipeIngredient,
  setSelectedRecipeIngredient,
  ingredients,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<RecipeUpate>>({});
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



  const options = ingredients.map((ing) => ({
    value: ing.id,
    label: ing.name,
  }));

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
                <Form.Label className="d-flex justify-content-between align-items-center">
                  <strong>Nguyên liệu cần dùng:</strong>
                  <Button
                    style={{
                      fontSize: "15px",
                    }}
                    variant="outline-primary"
                    className=""
                    onClick={() => {
                      setEditForm({
                        ...editForm,
                        recipeIngredients: [
                          ...(editForm.recipeIngredients ?? []),
                          {
                            ingredientId: "",
                            amountNeeded: "",
                            ingredient: { id: 0, name: "", unit: "" },
                          },
                        ],
                      });
                    }}
                  >
                    ➕ Thêm nguyên liệu
                  </Button>
                </Form.Label>
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Số lượng cần</th>
                      <th>Đơn vị</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editForm.recipeIngredients &&
                    editForm.recipeIngredients.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted">
                          <p>Không có nguyên liệu</p>
                        </td>
                      </tr>
                    ) : (
                      editForm.recipeIngredients?.map((e, index) => {
                        return (
                          <tr key={e.ingredient.id}>
                            <td className="align-middle">{e.ingredient.id}</td>
                            <td className="align-middle">
                              {/* {e.ingredient.name} */}
                              <Select<{ value: number; label: string }>
                                options={options}
                                placeholder="Chọn nguyên liệu"
                                className="basic-single "
                                classNamePrefix="select"
                                value={
                                  options.find(
                                    (opt) => opt.value === e.ingredient.id
                                  ) || null
                                }
                                onChange={(selected) => {
                                  if (!selected) return;
                                  const updated = [
                                    ...(editForm.recipeIngredients ?? []),
                                  ];
                                  const target = updated[index];
                                  if (target) {
                                    target.ingredientId = selected.value;
                                    target.ingredient = ingredients.find(
                                      (ing) => ing.id === selected.value
                                    ) || { id: 0, name: "", unit: "" };
                                    setEditForm({
                                      ...editForm,
                                      recipeIngredients: updated,
                                    });
                                  }
                                }}
                              />
                            </td>
                            <td className="align-middle">
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
                            <td className="align-middle">
                              {e.ingredient.unit}
                            </td>
                            <td className="align-middle">
                              <Button
                                variant="danger"
                                style={{
                                  padding: "5px 10px",
                                  fontSize: "14px",
                                }}
                                onClick={() => {
                                  const updated =
                                    editForm.recipeIngredients?.filter(
                                      (_, i) => i !== index
                                    ) ?? [];
                                  setEditForm({
                                    ...editForm,
                                    recipeIngredients: updated,
                                  });
                                }}
                              >
                                X
                              </Button>
                            </td>
                          </tr>
                        );
                      })
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
                  rows={3}
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
                  rows={3}
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
