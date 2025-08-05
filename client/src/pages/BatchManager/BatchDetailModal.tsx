import { useState } from "react";

import { type Batch } from "../../services/CRUD/CRUD_API_Batch";
import UpdateBatchModal from "./UpdateBatchModal";
import RecipeDetailModalFromBatch from "./RecipeDetailModalFromBatch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cancelBatchByIdAPI } from "../../services/CRUD/CRUD_API_Batch";
import { toast } from "sonner";
interface Props {
  showDetailModal: boolean;
  handleClose: () => void;
  selectedBatch: Batch | null;
  handleGetAllBatchesAPI: () => Promise<void>;
  setSelectedBatch: React.Dispatch<React.SetStateAction<Batch | null>>;
  handlePaginationAPI: () => void;
}

export default function BatchDetailModal({
  showDetailModal,
  handleClose,
  selectedBatch,
  setSelectedBatch,
  handleGetAllBatchesAPI,
  handlePaginationAPI,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailRecipeModal, setShowDetailRecipeModal] = useState(false);

  const handleCancelIngredientAPI = async (id: number) => {
    const cancelled = await cancelBatchByIdAPI(id);
    const errorMessage = cancelled.message;
    if (cancelled.data == null) {
      toast.error(`${errorMessage}`);
      return;
    }
    toast.success(`${errorMessage}`);
    handlePaginationAPI();
    handleClose();
  };

  return (
    <>
      <UpdateBatchModal
        handleClose={() => setShowUpdateModal(false)}
        showUpdateModal={showUpdateModal}
        handleGetAllBatchesAPI={handleGetAllBatchesAPI}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        handlePaginationAPI={handlePaginationAPI}
      />
      <RecipeDetailModalFromBatch
        showDetailRecipeModal={showDetailRecipeModal}
        handleClose={() => setShowDetailRecipeModal(false)}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
      />

      <Dialog
        open={showDetailModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết mẻ
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết về mẻ hiện tại.
            </DialogDescription>
          </DialogHeader>
          <Separator />

          <div className="grid gap-4 pt-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">{selectedBatch?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mã mẻ</p>
                <p className="text-base font-medium">{selectedBatch?.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tên mẻ</p>
                <p className="text-base ">{selectedBatch?.beerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thể tích</p>
                <p className="text-base">{selectedBatch?.volume}L</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground pt-1">Trạng thái</p>
                <p className="text-base pt-1">{selectedBatch?.status}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Công thức</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base m-0">{selectedBatch?.recipe?.name}</p>
                  {selectedBatch?.recipe && (
                    <Button
                      title="Xem chi tiết nguyên liệu"
                      onClick={() => setShowDetailRecipeModal(true)}
                      className="text-sm"
                      style={{ padding: "0px 10px" }}
                    >
                      📋 <span className="hidden sm:inline">Chi tiết</span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Ghi chú</p>
                <p className="text-base whitespace-pre-line">
                  {selectedBatch?.notes}
                </p>
              </div>

              <div className="">
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="text-base">
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
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Người tạo</p>
                <p className="text-base">
                  {selectedBatch?.createdBy?.username}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-3">
            <Button
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-500"
              onClick={() => setShowUpdateModal(true)}
              style={{
                padding: "5px 10px",
                fontSize: "14px",
              }}
            >
              ✏️ <span className="d-none d-sm-inline">Chỉnh sửa</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className=""
                  variant="destructive"
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                  }}
                >
                  🗑️ <span className="d-none d-sm-inline">Hủy</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn có chắc muốn hủy mẻ này?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Mẻ này sẽ chuyển trạng thái thành đã hủy, các liên kết của
                    nguyên liệu này sẽ bị ảnh hưởng
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleCancelIngredientAPI(selectedBatch?.id ?? 0)
                    }
                  >
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
