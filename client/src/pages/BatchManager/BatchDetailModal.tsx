import { useState, type JSX } from "react";
import { Modal, Button } from "react-bootstrap";
import type { Batch, Status } from "./BatchManager";
// import type { Status } from "@prisma/client";
interface Props {
  showModal: boolean;
  handleClose: () => void;
  statusOptions: () => void;
  selectedBatch: Batch | null;
  getStatusBadge: (type: Status) => JSX.Element;
}

export default function BatchDetailModal({
  showModal,
  handleClose,
  selectedBatch,
  getStatusBadge,
  statusOptions,
}: Props) {
  const [form, setForm] = useState();

  return (
    <>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết nguyên liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <div>
            <p>
              <strong>ID:</strong> {selectedBatch?.id}
            </p>
            <p>
              <strong>Code:</strong> {selectedBatch?.code}
            </p>
            <p>
              <strong>Tên:</strong> {selectedBatch?.beerName}
            </p>
            <p>
              <strong>Trạng thái: </strong>
              {selectedBatch?.status
                ? getStatusBadge(selectedBatch.status)
                : "Không xác định"}
            </p>

            <p>
              <strong>Khối lượng: </strong>
              {selectedBatch?.volume}L
            </p>

            <p>
              <strong>Ngày tạo: </strong>
              {selectedBatch?.createdAt &&
                new Date(selectedBatch.createdAt).toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                  hour12: false,
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
            <p>
              <strong>Ghi chú: </strong>
              <i>{selectedBatch?.notes}</i>
            </p>
            <p>
              <Button
                className=""
                variant="success"
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                }}
              >
                ✏️ <span className="d-none d-sm-inline">Cập nhật</span>
              </Button>
              <Button
                className="m-2"
                variant="danger"
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                }}
              >
                🗑️ <span className="d-none d-sm-inline">Xóa</span>
              </Button>
            </p>
            <p></p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
