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
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Thông tin nguyên liệu
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết về nguyên liệu hiện tại.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="grid gap-4 pt-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tên nguyên liệu</p>
                <p className="text-base font-medium">
                  {selectedIngredient?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loại</p>
                <p className="text-base">
                  {selectedIngredient?.status === "Đủ" && (
                    <Badge variant="secondary">
                      {selectedIngredient.status}
                    </Badge>
                  )}
                  {selectedIngredient?.status === "Sắp hết" && (
                    <Badge variant="outline">{selectedIngredient.status}</Badge>
                  )}
                  {selectedIngredient?.status === "Hết" && (
                    <Badge variant="destructive">
                      {selectedIngredient.status}
                    </Badge>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số lượng</p>
                <p className="text-base">{selectedIngredient?.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đơn vị</p>
                <p className="text-base">{selectedIngredient?.unit}</p>
              </div>
              <div className="col-span-full">
                {selectedIngredient?.notes && (
                  <>
                    <p className="text-sm text-muted-foreground">Mô tả</p>
                    <p className="text-base whitespace-pre-line">
                      {selectedIngredient.notes}
                    </p>
                  </>
                )}
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="text-base">
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
            </div>
          </div>

          <DialogFooter className="mt-3">
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
