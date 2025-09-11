import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
  deleteSupplierByIdAPI,
  type Supplier,
} from "@/services/CRUD/CRUD_API_Supplier";
import SupplierUpdateModal from "./SupplierUpdateModal";
import { useState } from "react";

interface Props {
  showDetailModal: boolean;
  handleClose: () => void;
  selectedSupplier: Supplier | null;
  handleGetAllSuppliersAPI: () => void;
}

export default function SupplierDetailModal({
  showDetailModal,
  handleClose,
  selectedSupplier,
  handleGetAllSuppliersAPI,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleDeleteSupplierAPI = async (id: number) => {
    const response = await deleteSupplierByIdAPI(id);
    const errorMessage = response.message;
    if (response.data == null) {
      toast.error(`${errorMessage}`);
      return;
    }
    toast.success(`${errorMessage}`);
    handleGetAllSuppliersAPI();
    handleClose();
  };
  return (
    <>
      <SupplierUpdateModal
        showUpdateModal={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        handleGetAllSuppliersAPI={handleGetAllSuppliersAPI}
        selectedSupplier={selectedSupplier}
      />
      <Dialog
        open={showDetailModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[440px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Thông tin nhà cung cấp
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết về nhà cung cấp hiện tại.
            </DialogDescription>
          </DialogHeader>
          <Separator />

          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="">
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">{selectedSupplier?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Tên nhà cung cấp
                </p>
                <p className="text-base font-medium">
                  {selectedSupplier?.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tên liên hệ</p>
                <p className="text-base ">{selectedSupplier?.contactName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="text-base">{selectedSupplier?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base">{selectedSupplier?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                <p className="text-base">{selectedSupplier?.address}</p>
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
                  🗑️ <span className="d-none d-sm-inline">Xóa</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn có chắc muốn xóa nguyên liệu này?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Nguyên liệu này sẽ bị đưa vào mục đã xóa, các liên kết của
                    nguyên liệu này sẽ bị ảnh hưởng
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleDeleteSupplierAPI(selectedSupplier?.id ?? 0)
                    }
                  >
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <DialogClose asChild>
              <Button variant="outline">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
