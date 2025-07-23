import { useState, type JSX } from "react";
import IngredientUpdateModal from "./IngredientUpdateModal";
import { type Ingredient } from "../../services/CRUD_API_Ingredient";
import { deleteIngredientByIdAPI } from "../../services/CRUD_API_Ingredient";
import {
  Dialog,
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
import { getBadgeClass } from "./IngredientUtils";
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
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">
                  {selectedIngredient?.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tên nguyên liệu</p>
                <p className="text-base font-medium">
                  {selectedIngredient?.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Loại</p>
                <p className="text-base">
                  {getIngredientIcon(selectedIngredient?.type || "")}
                  {selectedIngredient?.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số lượng</p>
                <p className="text-base">
                  {Number(selectedIngredient?.quantity).toFixed(2)}{" "}
                  {selectedIngredient?.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <p className="text-base">
                  <Badge
                    className={`me-1 ${getBadgeClass(
                      selectedIngredient?.status ?? ""
                    )}`}
                  >
                    {selectedIngredient?.status}
                  </Badge>
                </p>
              </div>
              <div>
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
              <div className="col-span-full">
                {selectedIngredient?.notes && (
                  <>
                    <p className="text-sm text-muted-foreground">Ghi chú</p>
                    <p className="text-base whitespace-pre-line">
                      {selectedIngredient.notes}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-3">
            <Button
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-500"
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
              <Button variant="outline">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
