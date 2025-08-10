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
import {
  deleteProductByIdAPI,
  type Product,
} from "@/services/CRUD/CRUD_API_Product";
import UpdateProductModal from "./UpdateProductModal";

interface Props {
  showDetailModal: boolean;
  handleClose: () => void;
  selectedProduct: Product | null;
  handleGetAllProductsAPI: () => void;
}

export default function ProductDetailModal({
  showDetailModal,
  handleClose,
  selectedProduct,
  handleGetAllProductsAPI,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const handleDeleteBeerProductById = async (id: number) => {
    const response = await deleteProductByIdAPI(id);
    const errorMessage = response.message;
    if (response.data == null) {
      toast.error(`${errorMessage}`);
      return;
    }
    toast.success(`${errorMessage}`);
    handleGetAllProductsAPI();
    handleClose();
  };
  return (
    <>
      <UpdateProductModal
        showUpdateModal={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        selectedProduct={selectedProduct}
        handleGetAllProductsAPI={handleGetAllProductsAPI}
      />
      <Dialog
        open={showDetailModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[400px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết loại sản phẩm
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Thông tin chi tiết về loại sản phẩm này.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">{selectedProduct?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mã loại bia</p>
                <p className="text-base font-medium">{selectedProduct?.code}</p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Tên loại bia</p>
                <p className="text-base">{selectedProduct?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p className="text-base">{selectedProduct?.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thể tích</p>
                <p className="text-base">{selectedProduct?.volume}</p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Đơn vị</p>
                <p className="text-base">{selectedProduct?.unitType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="text-base">
                  {selectedProduct?.createdAt &&
                    new Date(selectedProduct.createdAt).toLocaleString(
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

          <DialogFooter className="mt-4">
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
                      handleDeleteBeerProductById(selectedProduct?.id ?? 0)
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
