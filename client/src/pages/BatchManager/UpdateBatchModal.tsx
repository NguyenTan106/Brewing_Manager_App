import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  type Batch,
  Status,
  updateBatchByIdAPI,
} from "../../services/CRUD_API_Batch";
import Select from "react-select";
interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  handleGetAllBatchesAPI: () => Promise<void>;
  selectedBatch: Batch | null;
  statusOptions: { label: string; value: Status }[];
  setSelectedBatch: React.Dispatch<React.SetStateAction<Batch | null>>;
  handlePaginationAPI: () => void;
}

export default function UpdateBatchModal({
  showUpdateModal,
  setSelectedBatch,
  handleClose,
  //handleGetAllBatchesAPI,
  selectedBatch,
  statusOptions,
  handlePaginationAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Batch>>({});
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    value: Status;
  } | null>(null);

  const handleUpdateBatchByIdAPI = async (id: number) => {
    if (!id) return;
    try {
      if (
        editForm.beerName === "" ||
        editForm.status === ("" as Status) ||
        editForm.volume === "" ||
        editForm.notes === "" ||
        editForm.recipeId === ""
      ) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      if (
        selectedBatch?.beerName == editForm.beerName &&
        selectedBatch?.status == editForm.status &&
        selectedBatch?.volume == editForm.volume &&
        selectedBatch?.notes == editForm.notes &&
        selectedBatch?.recipeId == editForm.recipeId
      ) {
        alert("Không có thay đổi nào để cập nhật");
        return;
      }
      const data = await updateBatchByIdAPI(id, editForm);
      handleClose();
      handlePaginationAPI();
      setSelectedBatch(data.data);
    } catch (err) {
      console.error("Lỗi khi cập nhật mẻ:", err);
      alert("Lỗi khi cập nhật mẻ");
    }
  };
  useEffect(() => {
    if (editForm.status) {
      const found = statusOptions.find((opt) => opt.value === editForm.status);
      if (found) setSelectedStatus(found);
      else setSelectedStatus(null);
    } else {
      setSelectedStatus(null);
    }
  }, [editForm.status, statusOptions]);

  useEffect(() => {
    if (selectedBatch) {
      setEditForm(selectedBatch);
    }
  }, [selectedBatch]);

  return (
    <>
      <Modal show={showUpdateModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sửa nguyên liệu {selectedBatch?.beerName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              <strong>ID:</strong> {selectedBatch?.id}
            </p>
            <div>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Tên mẻ:</strong>
                </Form.Label>
                <Form.Control
                  placeholder="VD: Crystal 60L"
                  value={editForm?.beerName ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, beerName: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="status" className="mb-3">
                <Form.Label>
                  <strong>Trạng thái:</strong>
                </Form.Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  required
                  name="status"
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(option) => {
                    if (!option) return;
                    setEditForm((prev) => ({
                      ...prev,
                      status: option.value, // đây là Status enum
                    }));
                    setSelectedStatus(option);
                  }}
                  placeholder="Chọn trạng thái mẻ"
                  isClearable
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="volume" className="mb-3">
                <Form.Label>
                  <strong>Khối lượng mẻ (lít):</strong>
                </Form.Label>
                <Form.Control
                  placeholder="VD: g"
                  value={editForm?.volume ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, volume: e.target.value })
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
                  value={editForm?.notes ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      notes: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="" className="mb-3">
                <Form.Label>
                  <strong>Chọn công thức nấu:</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="VD: 20"
                  value={editForm?.recipeId ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      recipeId: e.target.value,
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
              selectedBatch?.id && handleUpdateBatchByIdAPI(selectedBatch?.id)
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
