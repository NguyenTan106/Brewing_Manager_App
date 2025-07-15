import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { getAllTypesAPI } from "../services/CRUD_API_type";
import { useState, useEffect } from "react";
import { createIngredientAPI } from "../services/CRUD_API_Ingredient";
interface Type {
  id: number;
  typeName: string;
}
type Props = {
  handleGetAllIngredientsAPI: () => void;
};

export function AddIngredient({ handleGetAllIngredientsAPI }: Props) {
  const [type, setType] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "",
    unit: "",
    quantity: "",
    lowStockThreshold: "",
    lastImportDate: "",
    notes: "",
  });

  useEffect(() => {
    handleGetAllTypesAPI();
  }, []);

  const handleGetAllTypesAPI = async () => {
    const data = await getAllTypesAPI();
    setType(data);
  };

  const clearForm = () => {
    setForm({
      name: "",
      type: "",
      unit: "",
      quantity: "",
      lowStockThreshold: "",
      lastImportDate: "",
      notes: "",
    });
  };

  const handleCreateIngredientAPI = async () => {
    const data = await createIngredientAPI({
      name: form.name,
      type: form.type,
      unit: form.unit,
      quantity: Number(form.quantity), // ✅ ép về number
      lowStockThreshold: Number(form.lowStockThreshold),
      lastImportDate: form.lastImportDate,
      notes: form.notes,
    });
    console.log(data);
    handleGetAllIngredientsAPI();
    clearForm();
    setSelectedType(null);
  };

  return (
    <>
      <Row className="">
        <h3>Thêm nguyên liệu mới</h3>
        <Col xs={12} md={10} lg={6}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>
              <strong>Tên:</strong>
            </Form.Label>
            <Form.Control
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Crystal 60L"
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={10} lg={6}>
          <Form.Group controlId="type" className="mb-3">
            <Form.Label>
              <strong>Loại nguyên liệu: </strong>
            </Form.Label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              required
              name="type"
              options={type.map((t) => ({
                label: t.typeName,
                value: t.id,
              }))}
              value={selectedType}
              onChange={(option) => {
                setForm((prev) => ({ ...prev, type: option?.label ?? "" })); // hoặc typeName nếu bạn dùng tên
                setSelectedType(option);
              }}
              placeholder="Chọn loại nguyên liệu"
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={10} lg={6}>
          <Form.Group controlId="unit" className="mb-3">
            <Form.Label>
              <strong>Đơn vị: </strong>
            </Form.Label>
            <Form.Control
              required
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="VD: g, kg"
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={10} lg={6}>
          <Form.Group controlId="quantity" className="mb-3">
            <Form.Label>
              <strong>Số lượng:</strong>
            </Form.Label>
            <Form.Control
              required
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="VD: 20"
            />
          </Form.Group>
        </Col>

        <Col xs={12} md={10} lg={6}>
          <Form.Group controlId="lowStockThreshold" className="mb-3">
            <Form.Label>
              <strong>Giới hạn cảnh báo:</strong>
            </Form.Label>
            <Form.Control
              required
              type="number"
              value={form.lowStockThreshold}
              onChange={(e) =>
                setForm({ ...form, lowStockThreshold: e.target.value })
              }
              placeholder="VD: 10"
            />
          </Form.Group>
        </Col>

        <Col xs={12} md={10} lg={6}>
          <Form.Group controlId="lastImportDate" className="mb-3">
            <Form.Label>
              <strong>Ngày nhập kho gần nhất:</strong>
            </Form.Label>
            <Form.Control
              required
              type="datetime-local"
              value={form.lastImportDate}
              onChange={(e) =>
                setForm({ ...form, lastImportDate: e.target.value })
              }
              placeholder="VD: 2025-07-15T14:30"
            />
          </Form.Group>
        </Col>

        <div>
          <Form.Group controlId="notes" className="mb-3">
            <Form.Label>
              <strong>Ghi chú:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="VD: 10"
            />
          </Form.Group>
        </div>

        <Button
          className=""
          variant="primary"
          onClick={() => handleCreateIngredientAPI()}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
          }}
        >
          <span className="d-none d-sm-inline">Thêm</span>
        </Button>
      </Row>
    </>
  );
}
