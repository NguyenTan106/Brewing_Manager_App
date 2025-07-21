import { useState, type JSX } from "react";
import { Modal } from "react-bootstrap";
import IngredientUpdateModal from "./IngredientUpdateModal";
import { type Ingredient } from "../../services/CRUD_API_Ingredient";
import { deleteIngredientByIdAPI } from "../../services/CRUD_API_Ingredient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  showDetailModal: boolean;
  setShowDetailModal: (value: boolean) => void;
  handleClose: () => void;
  selectedIngredient: Ingredient | null;
  getIngredientIcon: (type: string) => JSX.Element;
  handleGetAllIngredientsAPI: () => void;
  handlePaginationAPI: () => void;
}

export default function IngredientDetailModal({
  showDetailModal,
  setShowDetailModal,
  handleClose,
  selectedIngredient,
  getIngredientIcon,
  handleGetAllIngredientsAPI,
  handlePaginationAPI,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true);
    setShowDetailModal(false);
  };

  const handleDeleteIngredientAPI = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) {
      const response = await deleteIngredientByIdAPI(id);
      const errorMessage = response.message;
      if (response.data == null) {
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
      <IngredientUpdateModal
        handleClose={() => setShowUpdateModal(false)}
        selectedIngredient={selectedIngredient}
        showUpdateModal={showUpdateModal}
        handleGetAllIngredientsAPI={handleGetAllIngredientsAPI}
        handlePaginationAPI={handlePaginationAPI}
      />
      <Dialog
        open={showDetailModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiết nguyên liệu</DialogTitle>
          </DialogHeader>
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
                  variant="secondary"
                  className="me-1"
                  key={selectedIngredient?.id}
                >
                  {selectedIngredient?.status}
                </Badge>
              )}
              {selectedIngredient?.status === "Sắp hết" && (
                <Badge
                  variant="outline"
                  className="me-1"
                  key={selectedIngredient?.id}
                >
                  {selectedIngredient?.status}
                </Badge>
              )}
              {selectedIngredient?.status === "Hết" && (
                <Badge
                  variant="destructive"
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
          <DialogFooter>
            <Button
              className="bg-blue-500 text-white dark:bg-blue-600"
              onClick={() => handleOpenUpdateModal()}
              style={{
                padding: "5px 10px",
                fontSize: "14px",
              }}
            >
              ✏️ <span className="d-none d-sm-inline">Chỉnh sửa</span>
            </Button>
            <Button
              className=""
              variant="destructive"
              onClick={() =>
                handleDeleteIngredientAPI(selectedIngredient?.id ?? 0)
              }
              style={{
                padding: "5px 10px",
                fontSize: "14px",
              }}
            >
              🗑️ <span className="d-none d-sm-inline">Xóa</span>
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Huỷ</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
