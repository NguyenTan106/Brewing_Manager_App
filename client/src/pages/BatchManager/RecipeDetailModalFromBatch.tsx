import { Modal, Button, Table } from "react-bootstrap";
import type { Batch } from "../../services/CRUD_API_Batch";
interface Props {
  handleClose: () => void;
  showDetailRecipeModal: boolean;
  selectedBatch: Batch | null;
  usedIngredients: [];
}

export default function RecipeDetailModalFromBatch({
  handleClose,
  showDetailRecipeModal,
  selectedBatch,
  usedIngredients,
}: Props) {
  return (
    <>
      <Modal
        show={showDetailRecipeModal}
        onHide={handleClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết công thức</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              <strong>ID: </strong>
              {selectedBatch?.recipe && selectedBatch?.recipe.id}
            </p>
            <p>
              <strong>Tên công thức: </strong>
              {selectedBatch?.recipe && selectedBatch?.recipe.name}
            </p>
            <p>
              <strong>Mô tả: </strong>
              {selectedBatch?.recipe && selectedBatch?.recipe.description}
            </p>
            <strong>Nguyên liệu cần dùng:</strong>
            <div></div>
            <Table>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>ID</th>
                  <th style={{ width: "25%" }}>Tên</th>
                  <th style={{ width: "25%" }}>Số lượng cần</th>
                  <th style={{ width: "15%" }}>Loại</th>
                </tr>
              </thead>
              <tbody>
                {selectedBatch?.recipe &&
                selectedBatch?.recipe.recipeIngredients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      <p>Không có nguyên liệu</p>
                    </td>
                  </tr>
                ) : (
                  selectedBatch?.recipe &&
                  selectedBatch?.recipe.recipeIngredients.map((e, index) => (
                    <tr className="align-middle" key={e.ingredient.id}>
                      <td>{e.ingredient.id}</td>
                      <td>{e.ingredient.name}</td>
                      <td>
                        {usedIngredients?.[index] ?? "-"}
                        {e.ingredient.unit} / {selectedBatch.volume}L
                      </td>

                      <td>{e.ingredient.type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <p>
              <strong>Ghi chú: </strong>
              {selectedBatch?.recipe && selectedBatch?.recipe.note}
            </p>
            <p>
              <strong>Các bước thực hiện: </strong>
              {selectedBatch?.recipe && selectedBatch?.recipe.instructions}
            </p>
            <p>
              <strong>Ngày tạo: </strong>
              {selectedBatch?.recipe &&
                selectedBatch?.recipe.createdAt &&
                new Date(selectedBatch?.recipe.createdAt).toLocaleString(
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
