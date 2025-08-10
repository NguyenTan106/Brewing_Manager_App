import {
  BeerProductStatusDB,
  BeerProductStatusMapToUI,
  type BeerProduct,
  deleteBeerProductByIdAPI,
} from "@/services/CRUD/CRUD_API_BeerProduct";
import { useState } from "react";
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
import { toast } from "sonner";
import UpdateBeerProductModal from "./UpdateBeerProductModal";
interface Props {
  showDetailModal: boolean;
  handleClose: () => void;
  selectedBeerProduct: BeerProduct | null;
  handleGetAllBeerProductsAPI: () => void;
  // handlePaginationAPI: () => void;
}

export default function BeerProductDetailModal({
  showDetailModal,
  handleClose,
  selectedBeerProduct,
  handleGetAllBeerProductsAPI,
}: //   handlePaginationAPI,
Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleShowUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const handleDeleteBeerProductById = async (id: number) => {
    const response = await deleteBeerProductByIdAPI(id);
    const errorMessage = response.message;
    if (response.data == null) {
      toast.error(`${errorMessage}`);
      return;
    }
    toast.success(`${errorMessage}`);
    handleGetAllBeerProductsAPI();
    handleClose();
  };
  return (
    <>
      <UpdateBeerProductModal
        showUpdateModal={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        selectedBeerProduct={selectedBeerProduct}
        handleGetAllBeerProductsAPI={handleGetAllBeerProductsAPI}
      />

      <Dialog
        open={showDetailModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[400px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết lô thành phẩm
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Thông tin chi tiết về lô thành phẩm này.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">
                  {selectedBeerProduct?.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mã lô</p>
                <p className="text-base font-medium">
                  {selectedBeerProduct?.code}
                </p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Loại lô</p>
                <p className="text-base">
                  {selectedBeerProduct?.product?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <p className="text-base">
                  {
                    BeerProductStatusMapToUI[
                      selectedBeerProduct?.status as BeerProductStatusDB
                    ]
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số lượng</p>
                <p className="text-base">{selectedBeerProduct?.quantity}</p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Đơn vị</p>
                <p className="text-base">
                  {selectedBeerProduct?.product?.unitType}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ngày sản xuất</p>
                <p className="text-base">
                  {selectedBeerProduct?.productionDate &&
                    new Date(selectedBeerProduct.productionDate).toLocaleString(
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
              <div>
                <p className="text-sm text-muted-foreground">Ngày hết hạn</p>
                <p className="text-base">
                  {selectedBeerProduct?.expiryDate &&
                    new Date(selectedBeerProduct.expiryDate).toLocaleString(
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
              <div>
                <p className="text-sm text-muted-foreground">Ghi chú</p>
                <p className="text-base">{selectedBeerProduct?.notes}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-500"
              onClick={() => handleShowUpdateModal()}
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
                  variant="destructive"
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                  }}
                >
                  🗑️ <span className="d-none d-sm-inline">Xóa</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn có chắc muốn xóa người dùng này?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Người dùng này sẽ bị đưa vào mục đã xóa, các liên kết của
                    người dùng này vẫn được giữ nguyên.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleDeleteBeerProductById(selectedBeerProduct?.id ?? 0)
                    }
                  >
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
