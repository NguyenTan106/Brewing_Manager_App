import { useState, type JSX } from "react";
import { Modal, Button, Badge, Form } from "react-bootstrap";
import IngredientUpdateModal from "./IngredientUpdateModal";
import type { Ingredient } from "./IngredientManager";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  handleClose: () => void;
  selectedIngredient: Ingredient | null;
  getIngredientIcon: (type: string) => JSX.Element;
  handleGetAllIngredientsAPI: () => void;
}

export default function IngredientDetail({
  showModal,
  setShowModal,
  handleClose,
  selectedIngredient,
  getIngredientIcon,
  handleGetAllIngredientsAPI,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true);
    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết nguyên liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              <strong>ID:</strong> {selectedIngredient?.id}
            </p>
            <p>
              <strong>Tên:</strong> {selectedIngredient?.name}
            </p>
            <p>
              <strong>Loại:</strong>
              {selectedIngredient?.type &&
                getIngredientIcon(selectedIngredient.type)}
              {selectedIngredient?.type}
            </p>
            <p>
              <strong>Số lượng:</strong> {selectedIngredient?.quantity}{" "}
              {selectedIngredient?.unit}
            </p>
            <p>
              <strong>Trạng thái: </strong>
              {selectedIngredient?.status === "Đủ" && (
                <Badge
                  bg="success"
                  className="me-1"
                  key={selectedIngredient?.id}
                >
                  {selectedIngredient?.status}
                </Badge>
              )}
              {selectedIngredient?.status === "Sắp hết" && (
                <Badge
                  bg="warning"
                  className="me-1"
                  key={selectedIngredient?.id}
                >
                  {selectedIngredient?.status}
                </Badge>
              )}
              {selectedIngredient?.status === "Hết" && (
                <Badge
                  bg="danger"
                  className="me-1"
                  key={selectedIngredient?.id}
                >
                  {selectedIngredient?.status}
                </Badge>
              )}
            </p>
            <p>
              <strong>Ghi chú: </strong>
              <i>{selectedIngredient?.notes}</i>
            </p>
            <p>
              <strong>Ngày nhập kho gần nhất: </strong>
              {selectedIngredient?.lastImportDate &&
                new Date(selectedIngredient.lastImportDate).toLocaleString(
                  "vi-VN",
                  {
                    timeZone: "Asia/Ho_Chi_Minh",
                    hour12: false,
                  }
                )}
            </p>
            <p>
              <Button
                className=""
                variant="success"
                onClick={() => handleOpenUpdateModal()}
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

      <IngredientUpdateModal
        handleCloseUpdateModal={handleCloseUpdateModal}
        selectedIngredient={selectedIngredient}
        showUpdateModal={showUpdateModal}
        handleGetAllIngredientsAPI={handleGetAllIngredientsAPI}
      />
    </>
  );
}
