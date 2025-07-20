import { useState, type JSX } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  type Batch,
  // type Recipe,
  Status,
  deleteBatchByIdAPI,
} from "../../services/CRUD_API_Batch";
import UpdateBatchModal from "./UpdateBatchModal";
import RecipeDetailModalFromBatch from "./RecipeDetailModalFromBatch";

interface Props {
  showDetailModal: boolean;
  handleClose: () => void;
  selectedBatch: Batch | null;
  getStatusBadge: (type: Status) => JSX.Element;
  handleGetAllBatchesAPI: () => Promise<void>;
  statusOptions: { label: string; value: Status }[];
  setSelectedBatch: React.Dispatch<React.SetStateAction<Batch | null>>;
  handlePaginationAPI: () => void;
  usedIngredients: [];
}

export default function BatchDetailModal({
  showDetailModal,
  handleClose,
  selectedBatch,
  setSelectedBatch,
  getStatusBadge,
  handleGetAllBatchesAPI,
  statusOptions,
  handlePaginationAPI,
  usedIngredients,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailRecipeModal, setShowDetailRecipeModal] = useState(false);
  const handleDeleteBatchByIdAPI = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mẻ này?")) {
      const deleted = await deleteBatchByIdAPI(id);
      console.log(deleted);
      const errorMessage = deleted.message;
      if (deleted.data == null) {
        alert(`${errorMessage}`);
        return;
      }
      alert(`${errorMessage}`);
      handlePaginationAPI();
      handleClose();
    }
  };

  return (
    <>
      <UpdateBatchModal
        handleClose={() => setShowUpdateModal(false)}
        showUpdateModal={showUpdateModal}
        handleGetAllBatchesAPI={handleGetAllBatchesAPI}
        selectedBatch={selectedBatch}
        statusOptions={statusOptions}
        setSelectedBatch={setSelectedBatch}
        handlePaginationAPI={handlePaginationAPI}
      />
      <RecipeDetailModalFromBatch
        showDetailRecipeModal={showDetailRecipeModal}
        handleClose={() => setShowDetailRecipeModal(false)}
        selectedBatch={selectedBatch}
        usedIngredients={usedIngredients}
      />
      <Modal show={showDetailModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết mẻ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              <strong>Công thức: </strong>
              {selectedBatch?.recipe === null
                ? "Chưa có công thức"
                : selectedBatch?.recipe?.name && (
                    <>
                      {selectedBatch?.recipe.name}{" "}
                      <Button
                        title="Xem chi tiết nguyên liệu"
                        variant="info"
                        onClick={() => setShowDetailRecipeModal(true)}
                        style={{ padding: "5px 10px", fontSize: "14px" }}
                      >
                        📋 <span className="d-none d-sm-inline">Chi tiết</span>
                      </Button>
                    </>
                  )}
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
            <div>
              <strong>Ghi chú: </strong>
              <i>{selectedBatch?.notes}</i>
            </div>
            <div className="mt-2">
              <Button
                className=""
                variant="success"
                onClick={() => setShowUpdateModal(true)}
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                }}
              >
                ✏️ <span className="d-none d-sm-inline">Chỉnh sửa</span>
              </Button>
              <Button
                className="m-2"
                variant="danger"
                onClick={() =>
                  selectedBatch?.id &&
                  handleDeleteBatchByIdAPI(selectedBatch?.id)
                }
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                }}
              >
                🗑️ <span className="d-none d-sm-inline">Xóa</span>
              </Button>
            </div>
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
