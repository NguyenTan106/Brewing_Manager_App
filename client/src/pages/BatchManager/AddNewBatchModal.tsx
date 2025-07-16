import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useState } from "react";
import Select from "react-select";
import { createBatchAPI, Status } from "../../services/CRUD_API_Batch";
interface Props {
  showAddModal: boolean;
  handleClose: () => void;
  handleGetAllBatchesAPI: () => Promise<void>;
  statusOptions: { label: string; value: Status }[];
}
export default function AddNewBatchModal({
  showAddModal,
  handleClose,
  handleGetAllBatchesAPI,
  statusOptions,
}: Props) {
  const [form, setForm] = useState({
    beerName: "",
    status: "" as Status,
    volume: "",
    notes: "",
    recipeId: "",
  });
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    value: Status;
  } | null>(null);

  const clearForm = () => {
    setForm({
      beerName: "",
      status: "" as Status,
      volume: "",
      notes: "",
      recipeId: "",
    });
  };

  const handleCreateBatchAPI = async () => {
    if (
      form.beerName === "" ||
      form.status === ("" as Status) ||
      form.volume === "" ||
      form.notes === ""
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const data = await createBatchAPI(form);
    if (data.data == null) {
      alert(data.message);
      return;
    }
    if (data.data) {
      alert(data.message);
    }

    await handleGetAllBatchesAPI();
    clearForm();
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
                  <strong>Tên mẻ:</strong>
                </Form.Label>
                <Form.Control
                  required
                  value={form.beerName}
                  onChange={(e) =>
                    setForm({ ...form, beerName: e.target.value })
                  }
                  placeholder="VD: "
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group controlId="type" className="mb-3">
                <Form.Label>
                  <strong>Trạng thái: </strong>
                </Form.Label>
                <div className="d-flex gap-2 align-items-center">
                  <div style={{ flex: 1 }}>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      required
                      name="status"
                      options={statusOptions}
                      value={selectedStatus}
                      onChange={(option) => {
                        if (!option) return;
                        setForm((prev) => ({
                          ...prev,
                          status: option.value, // đây là Status enum
                        }));
                        setSelectedStatus(option);
                      }}
                      placeholder="Chọn trạng thái mẻ"
                      isClearable
                    />
                  </div>
                </div>
              </Form.Group>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Group controlId="volume" className="mb-3">
                <Form.Label>
                  <strong>Khối lượng mẻ (Lít): </strong>
                </Form.Label>
                <Form.Control
                  required
                  type="numer"
                  value={form.volume}
                  onChange={(e) => setForm({ ...form, volume: e.target.value })}
                  placeholder="VD: g, kg"
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={6}>
              <Form.Group controlId="lowStockThreshold" className="mb-3">
                <Form.Label>
                  <strong>Chọn công thức nấu:</strong>
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  value={form.recipeId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      recipeId: e.target.value,
                    })
                  }
                  placeholder="VD: 10"
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={12}>
              <Form.Group controlId="notes" className="mb-3">
                <Form.Label>
                  <strong>Ghi chú:</strong>
                </Form.Label>
                <Form.Control
                  required
                  rows={4}
                  as={"textarea"}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
            onClick={() => handleCreateBatchAPI()}
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
