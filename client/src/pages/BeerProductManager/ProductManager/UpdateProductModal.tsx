import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  updateProductByIdAPI,
  type Product,
} from "@/services/CRUD/CRUD_API_Product";
import { useEffect, useState } from "react";

interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  selectedProduct: Product | null;
  handleGetAllProductsAPI: () => void;
}

export default function UpdateProductModal({
  showUpdateModal,
  handleClose,
  selectedProduct,
  handleGetAllProductsAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  useEffect(() => {
    if (selectedProduct) {
      setEditForm(selectedProduct);
    }
  }, [selectedProduct]);
  const handleUpdateProductByIdAPI = async (id: number) => {
    if (!id) return;
    try {
      if (
        editForm.code === "" ||
        editForm.name === "" ||
        editForm.description === "" ||
        editForm.volume === "" ||
        editForm.unitType === ""
      ) {
        toast.warning("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      if (
        selectedProduct?.code == editForm.code &&
        selectedProduct?.name == editForm.name &&
        selectedProduct?.description == editForm.description &&
        selectedProduct?.volume == editForm.volume &&
        selectedProduct?.unitType == editForm.unitType
      ) {
        toast.warning("Không có thay đổi nào để cập nhật");
        return;
      }
      await updateProductByIdAPI(id, editForm);

      handleClose();
      handleGetAllProductsAPI();
      toast.success("Cập nhật loại bia thành công", {
        description: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật loại bia:", err);
      toast.error("Lỗi khi cập nhật loại bia");
    }
  };
  return (
    <>
      <Dialog
        open={showUpdateModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <form>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Cập nhật lô thanh phẩm
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin lô thành phẩm: {selectedProduct?.code}
              </DialogDescription>
            </DialogHeader>

            <Separator />

            <div className="grid gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full min-w-0 ">
                  <Label className="text-base">
                    <strong>ID:</strong> {selectedProduct?.id}
                  </Label>
                </div>
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0 ">
                  <Label className="text-base">
                    <strong>Mã loại bia</strong>
                  </Label>
                  <Input
                    style={{
                      fontSize: "0.95rem",
                    }}
                    placeholder="PALEALE-330"
                    value={editForm?.code ?? ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        code: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0 ">
                  <Label className="text-base">
                    <strong>Tên loại bia</strong>
                  </Label>
                  <Input
                    style={{
                      fontSize: "0.95rem",
                    }}
                    placeholder="Bia paleale 330ml"
                    value={editForm?.name ?? ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Thể tích trên mỗi đơn vị:</strong>
                  </Label>
                  <Input
                    style={{
                      fontSize: "0.95rem",
                    }}
                    type="number"
                    placeholder="VD: 20"
                    value={editForm?.volume ?? ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        volume: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Đơn vị:</strong>
                  </Label>
                  <Input
                    style={{
                      fontSize: "0.95rem",
                    }}
                    placeholder="VD: chai"
                    value={editForm?.unitType ?? ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        unitType: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
                  <Label className="text-base font-bold">Ghi chú:</Label>
                  <Textarea
                    style={{ fontSize: "0.95rem" }}
                    placeholder="Nhập ghi chú..."
                    value={editForm?.description ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={4} // có thể chỉnh số dòng
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="secondary"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => {
                  if (selectedProduct?.id)
                    handleUpdateProductByIdAPI(selectedProduct?.id);
                }}
                style={{
                  padding: "5px 10px",
                }}
              >
                ✏️ <span className="d-none d-sm-inline">Cập nhật</span>
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Huỷ</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
