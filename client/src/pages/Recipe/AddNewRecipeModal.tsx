import { useState } from "react";
import { Modal, Row, Col, Button, Form } from "react-bootstrap";
import { createRecipeAPI } from "../../services/CRUD_API_Recipe";
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
