import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateIngredientByIdAPI } from "../services/CRUD_API_Ingredient";
import type { Ingredient } from "./IngredientManager";

type Props = {
  handleCloseUpdateModal: () => void;
  selectedIngredient: Ingredient | null;
  showUpdateModal: boolean;
  handleGetAllIngredientsAPI: () => void;
};

export default function IngredientUpdateModal({
  handleCloseUpdateModal,
  selectedIngredient,
  showUpdateModal,
  handleGetAllIngredientsAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Ingredient>>({});

  useEffect(() => {
    if (selectedIngredient) {
      setEditForm(selectedIngredient);
    }
  }, [selectedIngredient]);

  const handleUpdateIngredientByIdAPI = async (id: number | undefined) => {
    if (!id) return;
    try {
      await updateIngredientByIdAPI(id, editForm);

      handleCloseUpdateModal();
      handleGetAllIngredientsAPI();
      alert("Thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật nguyên liệu:", err);
    }
  };

  const toDatetimeLocalValue = (dateString: string) => {
    const date = new Date(dateString); // ISO string từ DB
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const fromDatetimeLocalValue = (value: string) => {
    const date = new Date(value); // local
    return date.toISOString(); // chuẩn UTC ISO-8601
  };

  return (
    <>
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa nguyên liệu {selectedIngredient?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              <strong>ID:</strong> {selectedIngredient?.id}
            </p>
            <p>
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
            </p>
            <p>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Loại:</strong>
                </Form.Label>
                <Form.Control
                  placeholder="VD: malt"
                  value={editForm?.type ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, type: e.target.value })
                  }
                />
              </Form.Group>
            </p>
            <p>
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
            </p>
            <p>
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
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </p>
            <p>
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
                      lowStockThreshold: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </p>
            <p>
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
            </p>
          </div>
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
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
