import { useState } from "react";
import { Modal, Row, Col, Button, Form, Table } from "react-bootstrap";
import { createRecipeAPI } from "../../services/CRUD_API_Recipe";
import Select from "react-select";
import type { Ingredient } from "../../services/CRUD_API_Ingredient";
import { type RecipeIngredientInput } from "../../services/CRUD_API_Recipe";
import { customStyles } from "./CustomSelect";
interface Props {
  showAddModal: boolean;
  handleClose: () => void;
  handleGetAllRecipesAPI: () => Promise<void>;
  ingredients: Ingredient[];
}

export default function AddNewRecipeModal({
  showAddModal,
  handleClose,
  handleGetAllRecipesAPI,
  ingredients,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    note: "",
    instructions: "",
    recipeIngredients: [] as RecipeIngredientInput[],
  });

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      note: "",
      instructions: "",
      recipeIngredients: [],
    });
  };

  const handleCreateRecipeAPI = async () => {
    if (
      form.name === "" ||
      form.description === "" ||
      form.note === "" ||
      form.instructions === "" ||
      form.recipeIngredients.length === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const data = await createRecipeAPI(form);
    if (data.data == null) {
      alert(data.message);
      return;
    }
    if (data.data) {
      alert(data.message);
    }
    clearForm();
    await handleGetAllRecipesAPI();
  };

  const options = ingredients.map((ing) => ({
    value: ing.id,
    label: ing.name,
  }));

  return (
    <>
      <Modal show={showAddModal} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm nguyên mẻ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="">
            <Col lg={6}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>
                  <strong>Tên công thức:</strong>
                </Form.Label>
                <Form.Control
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: "
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Group controlId="volume" className="mb-3">
                <Form.Label>
                  <strong>Mô tả: </strong>
                </Form.Label>
                <Form.Control
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="VD: g, kg"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Label>
                <strong>Chọn nguyên liệu: </strong>
              </Form.Label>
              <Table size="sm">
                <thead className="">
                  <tr>
                    <th style={{ width: "40%" }}>Nguyên liệu</th>
                    <th style={{ width: "30%" }}>Lượng cần dùng</th>
                    <th style={{ width: "10%" }}>Loại</th>
                    <th style={{ width: "10%" }}>Đơn vị</th>
                    <th style={{ width: "10%", textAlign: "center" }}>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {form.recipeIngredients.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ padding: "2px 30px 2px 2px" }}>
                          <Select
                            styles={customStyles}
                            options={options}
                            placeholder="Chọn nguyên liệu"
                            className="basic-single "
                            classNamePrefix="select"
                            onChange={(selected) => {
                              const updated = [...form.recipeIngredients];
                              const target = updated[index];
                              if (target) {
                                target.ingredientId = selected?.value || "";
                                setForm({
                                  ...form,
                                  recipeIngredients: updated,
                                });
                              }
                            }}
                          />
                        </td>
                        <td style={{ padding: "2px 30px 2px 2px" }}>
                          <Form.Control
                            style={{
                              border: "none",
                              fontSize: "16px",
                              height: "100%",
                              margin: "2px 0px 2px 0",
                            }}
                            type="number"
                            placeholder="Số lượng"
                            className="form-control-sm rounded shadow-sm bg-light border-0 align-middle"
                            value={item.amountNeeded}
                            onChange={(e) => {
                              const updated = [...form.recipeIngredients];
                              const target = updated[index];
                              if (target) {
                                target.amountNeeded = e.target.value;
                                setForm({
                                  ...form,
                                  recipeIngredients: updated,
                                });
                              }
                            }}
                          />
                        </td>
                        <td className="align-middle">
                          {ingredients.find(
                            (ing) => ing.id === item.ingredientId
                          )?.type || "-"}
                        </td>
                        <td className="align-middle">
                          {ingredients.find(
                            (ing) => ing.id === item.ingredientId
                          )?.unit || "-"}
                        </td>

                        <td className="text-center align-middle">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const updated = form.recipeIngredients.filter(
                                (_, i) => i !== index
                              );
                              setForm({ ...form, recipeIngredients: updated });
                            }}
                          >
                            X
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              <Button
                variant="outline-primary"
                className="mb-3 al"
                onClick={() =>
                  setForm({
                    ...form,
                    recipeIngredients: [
                      ...form.recipeIngredients,
                      { ingredientId: "", amountNeeded: "" },
                    ],
                  })
                }
              >
                ➕ Thêm nguyên liệu
              </Button>
            </Col>

            <Col xs={12} lg={12}>
              <Form.Group controlId="lowStockThreshold" className="mb-3">
                <Form.Label>
                  <strong>Ghi chú:</strong>
                </Form.Label>
                <Form.Control
                  required
                  rows={2}
                  as={"textarea"}
                  value={form.note}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      note: e.target.value,
                    })
                  }
                  placeholder="VD: 10"
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={12}>
              <Form.Group controlId="notes" className="mb-3">
                <Form.Label>
                  <strong>Các bước thực hiện:</strong>
                </Form.Label>
                <Form.Control
                  required
                  rows={4}
                  as={"textarea"}
                  value={form.instructions}
                  onChange={(e) =>
                    setForm({ ...form, instructions: e.target.value })
                  }
                  placeholder="VD: "
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className=""
            variant="primary"
            onClick={() => handleCreateRecipeAPI()}
          >
            <span className="d-sm-inline">Thêm</span>
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
