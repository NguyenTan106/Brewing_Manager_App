import { useState, type JSX } from "react";

import {
  type Batch,
  // type Recipe,
  Status,
} from "../../services/CRUD_API_Batch";
import UpdateBatchModal from "./UpdateBatchModal";
import RecipeDetailModalFromBatch from "./RecipeDetailModalFromBatch";
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
  handleClose: () => void;
  selectedBatch: Batch | null;
  getStatusBadge: (type: Status) => JSX.Element;
  handleGetAllBatchesAPI: () => Promise<void>;
  statusOptions: { label: string; value: Status }[];
  setSelectedBatch: React.Dispatch<React.SetStateAction<Batch | null>>;
  handlePaginationAPI: () => void;
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
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailRecipeModal, setShowDetailRecipeModal] = useState(false);

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
                <p className="text-sm text-muted-foreground">Khối lượng</p>
                <p className="text-base">{selectedBatch?.volume}L</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground pt-1">Trạng thái</p>
                <p className="text-base pt-1">
                  {selectedBatch?.status
                    ? getStatusBadge(selectedBatch.status)
                    : "Không xác định"}
                </p>
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
              <div className="col-span-full">
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

            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
