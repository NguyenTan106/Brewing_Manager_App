import { useState } from "react";
import { Modal, Row, Col, Button, Form, Table } from "react-bootstrap";
import { createRecipeAPI } from "../../services/CRUD_API_Recipe";
import { FaPlus } from "react-icons/fa";
interface Props {
  showAddModal: boolean;
  handleClose: () => void;
  handleGetAllRecipesAPI: () => Promise<void>;
}

export default function AddNewRecipeModal({
  showAddModal,
  handleClose,
  handleGetAllRecipesAPI,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    note: "",
    instructions: "",
  });

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      note: "",
      instructions: "",
    });
  };

  const handleCreateRecipeAPI = async () => {
    if (
      form.name === "" ||
      form.description === "" ||
      form.note === "" ||
      form.instructions === ""
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

  const [newIngredients, setNewIngredients] = useState([
    { ingredientId: "", amountNeeded: "" },
  ]);

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
              <Table hover size="sm">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "40%" }}>Nguyên liệu</th>
                    <th style={{ width: "30%" }}>Lượng cần dùng</th>
                    <th style={{ width: "10%" }}>Đơn vị</th>
                    <th style={{ width: "10%" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {newIngredients.map((item, index) => {
                    // const selectedIngredient = ingredientList.find(
                    //   (ing) => ing.id === Number(item.ingredientId)
                    // );

                    return (
                      <tr key={index}>
                        <td>
                          <Form.Select
                            style={{ border: "none" }}
                            value={item.ingredientId}
                            onChange={(e) => {
                              const updated = [...newIngredients];
                              updated[index].ingredientId = e.target.value;
                              setNewIngredients(updated);
                            }}
                          >
                            <option value="">-- Chọn nguyên liệu --</option>
                            {/* {ingredientList.map((ing) => (
                              <option key={ing.id} value={ing.id}>
                                {ing.name}
                              </option>
                            ))} */}
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Control
                            style={{ border: "none" }}
                            type="number"
                            placeholder="Số lượng"
                            value={item.amountNeeded}
                            onChange={(e) => {
                              const updated = [...newIngredients];
                              updated[index].amountNeeded = e.target.value;
                              setNewIngredients(updated);
                            }}
                          />
                        </td>
                        <td className="text-center">
                          {/* {selectedIngredient?.unit || "-"} */}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const updated = [...newIngredients];
                              updated.splice(index, 1);
                              setNewIngredients(updated);
                            }}
                          >
                            ❌
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
                  setNewIngredients([
                    ...newIngredients,
                    { ingredientId: "", amountNeeded: "" },
                  ])
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
            <span className="d-none d-sm-inline">Thêm</span>
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
