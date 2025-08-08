import {
  updateSupplierByIdAPI,
  type Supplier,
} from "@/services/CRUD/CRUD_API_Supplier";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  selectedSupplier: Supplier | null;
  handleGetAllSuppliersAPI: () => void;
}

export default function SupplierUpdateModal({
  showUpdateModal,
  handleClose,
  selectedSupplier,
  handleGetAllSuppliersAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Supplier>>({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
  });
  useEffect(() => {
    if (selectedSupplier) {
      setEditForm(selectedSupplier);
    }
  }, [selectedSupplier]);

  const handleUpdateSupplierAPI = async (id: number) => {
    if (!id) {
      toast.error("ID nhà cung cấp không hợp lệ");
      return;
    }
    try {
      if (
        editForm.name === "" ||
        editForm.contactName === "" ||
        editForm.phone === ""
      ) {
        toast.warning("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      if (
        selectedSupplier?.name == editForm.name &&
        selectedSupplier?.contactName == editForm.contactName &&
        selectedSupplier?.phone == editForm.phone &&
        selectedSupplier?.email == editForm.email &&
        selectedSupplier?.address == editForm.address
      ) {
        toast.warning("Không có thay đổi nào để cập nhật");
        return;
      }
      const response = await updateSupplierByIdAPI(id, editForm);
      if (response.data) {
        toast.success("Cập nhật nhà cung cấp thành công", {
          description: new Date().toLocaleTimeString(),
        });
        handleGetAllSuppliersAPI();
        handleClose();
      }
    } catch (e) {
      console.error("Lỗi khi cập nhật nguyên liệu:", e);
      toast.error("Cập nhật nhà cung cấp thất bại");
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
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Sửa thông tin nhà cung cấp
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Cập nhật thông tin nhà cung cấp hiện tại.
              </DialogDescription>
            </DialogHeader>
            <Separator />

            <div className="grid gap-4">
              <Label className="text-base">
                <strong>ID:</strong> {selectedSupplier?.id}
              </Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full min-w-0 ">
                  <Label className="text-base">
                    <strong>Tên:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    placeholder="VD: Crystal 60L"
                    value={editForm?.name ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Tên liên hệ:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    placeholder="VD: g"
                    value={editForm?.contactName ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, contactName: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Số điện thoại:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    placeholder="VD: 20"
                    value={editForm?.phone ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full  min-w-0">
                  <Label className="text-base">
                    <strong>Email:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    placeholder="VD: 20"
                    value={editForm?.email ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
                  <Label className="text-base font-bold">Địa chỉ:</Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    placeholder="Nhập địa chỉ..."
                    value={editForm?.address ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() =>
                  handleUpdateSupplierAPI(selectedSupplier?.id ?? 0)
                }
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
