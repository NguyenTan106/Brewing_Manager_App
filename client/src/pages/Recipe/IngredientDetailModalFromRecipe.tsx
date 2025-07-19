import { Modal, Button, Badge } from "react-bootstrap";
import { type Ingredient } from "../../services/CRUD_API_Ingredient";
import { getIngredientIcon } from "../IngredientManager/IngredientIcon";
interface Props {
  showDetailIngredientModal: boolean;
  handleClose: () => void;
  selectedIngredient: Ingredient;
}

export default function IngredientDetailModalFromRecipe({
  showDetailIngredientModal,
  handleClose,
  selectedIngredient,
}: Props) {
  return (
    <>
      <Modal show={showDetailIngredientModal} onHide={handleClose} centered>
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
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
            </p>
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
