import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { updateIngredientByIdAPI } from "../../services/CRUD_API_Ingredient";
import { type Ingredient } from "../../services/CRUD_API_Ingredient";
import Select from "react-select";
import { getAllTypesAPI } from "../../services/CRUD_API_type";
type Props = {
  handleClose: () => void;
  selectedIngredient: Ingredient | null;
  showUpdateModal: boolean;
  handleGetAllIngredientsAPI: () => void;
  handlePaginationAPI: () => void;
};

export interface Type {
  id: number;
  typeName: string;
}

export default function IngredientUpdateModal({
  handleClose,
  selectedIngredient,
  showUpdateModal,
  // handleGetAllIngredientsAPI,
  handlePaginationAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Ingredient>>({});
  const [type, setType] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<{
    label: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    if (selectedIngredient) {
      setEditForm(selectedIngredient);

      const matchedType = type.find(
        (t) => t.typeName === selectedIngredient.type
      );

      if (matchedType) {
        setSelectedType({
          label: matchedType.typeName,
          value: matchedType.id,
        });
      }
    }
  }, [selectedIngredient, type]);

  useEffect(() => {
    handleGetAllTypesAPI();
    if (selectedIngredient) {
      setEditForm(selectedIngredient);
    }
  }, [selectedIngredient]);

  const handleGetAllTypesAPI = async () => {
    const data = await getAllTypesAPI();
    setType(data);
  };

  const handleUpdateIngredientByIdAPI = async (id: number | undefined) => {
    if (!id) return;
    try {
      if (
        editForm.name === "" ||
        editForm.type === "" ||
        editForm.unit === "" ||
        editForm.quantity === "" ||
        editForm.lowStockThreshold === "" ||
        editForm.lastImportDate === null
      ) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      if (
        selectedIngredient?.quantity == editForm.quantity &&
        selectedIngredient?.lowStockThreshold == editForm.lowStockThreshold &&
        selectedIngredient?.lastImportDate == editForm.lastImportDate &&
        selectedIngredient?.name == editForm.name &&
        selectedIngredient?.type == editForm.type &&
        selectedIngredient?.unit == editForm.unit &&
        selectedIngredient?.notes == editForm.notes
      ) {
        alert("Không có thay đổi nào để cập nhật");
        return;
      }
      await updateIngredientByIdAPI(id, editForm);

      handleClose();
      // handleGetAllIngredientsAPI();
      handlePaginationAPI();
      alert("Thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật nguyên liệu:", err);
      alert("Lỗi khi cập nhật nguyên liệu");
    }
  };

  const toDatetimeLocalValue = (dateString: string) => {
    const date = new Date(dateString); // ISO string từ DB
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const fromDatetimeLocalValue = (value: string) => {
    if (!value || isNaN(Date.parse(value))) {
      console.warn("Giá trị ngày giờ không hợp lệ:", value);
      return null;
    }
    const date = new Date(value);
    return date.toISOString();
  };

  return (
    <>
      <Modal show={showUpdateModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Sửa nguyên liệu {selectedIngredient?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <p>
              <strong>ID:</strong> {selectedIngredient?.id}
            </p>
            <Col lg={6}>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Tên:</strong>
                </Form.Label>
                <Form.Control
                  placeholder="VD: Crystal 60L"
                  value={editForm?.name ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Loại:</strong>
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
                    setEditForm((prev) => ({
                      ...prev,
                      type: option?.label ?? "",
                    })); // hoặc typeName nếu bạn dùng tên
                    setSelectedType(option);
                  }}
                  placeholder="Chọn loại nguyên liệu"
                />
              </Form.Group>
            </Col>
            <Col lg={4}>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Đơn vị:</strong>
                </Form.Label>
                <Form.Control
                  placeholder="VD: g"
                  value={editForm?.unit ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, unit: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={4}>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Số lượng:</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="VD: 20"
                  value={editForm?.quantity ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      quantity:
                        e.target.value === "" ? "" : parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={4}>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Giới hạn cảnh báo:</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="VD: 20"
                  value={editForm?.lowStockThreshold ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      lowStockThreshold:
                        e.target.value === "" ? "" : parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
            <div>
              <Form.Group controlId="lastImportDate" className="mb-3">
                <Form.Label>
                  <strong>Ngày nhập kho gần nhất:</strong>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={
                    editForm?.lastImportDate
                      ? toDatetimeLocalValue(editForm.lastImportDate)
                      : ""
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      lastImportDate: fromDatetimeLocalValue(e.target.value),
                    })
                  }
                  placeholder="VD: 2025-07-15T14:30"
                />
              </Form.Group>
            </div>
            <p>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Ghi chú:</strong>
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={3}
                  placeholder="VD: g"
                  value={editForm?.notes ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                />
              </Form.Group>
            </p>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className=""
            variant="success"
            onClick={() =>
              handleUpdateIngredientByIdAPI(selectedIngredient?.id)
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
