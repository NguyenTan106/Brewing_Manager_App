import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { createNewSupplierAPI } from "@/services/CRUD/CRUD_API_Supplier";

interface Props {
  showAddNewSupplierModal: boolean;
  handleClose: () => void;
  handleGetAllSuppliersAPI: () => void;
}

export default function AddNewSupplier({
  showAddNewSupplierModal,
  handleClose,
  handleGetAllSuppliersAPI,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
  });

  const clearForm = () => {
    setForm({
      name: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  const handleCreateSupplierAPI = async () => {
    try {
      if (form.name === "" || form.contactName === "" || form.phone === "") {
        toast.warning("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Here you would typically call your API to create a new supplier
      const data = await createNewSupplierAPI(form);
      if (data.data == null) {
        toast.error(data.message);
        return;
      }
      if (data.data) {
        toast.success(data.message, {
          description: new Date().toLocaleTimeString(),
        });
      }
      handleClose();
      handleGetAllSuppliersAPI();
      clearForm();
    } catch (error) {
      console.error("Error creating supplier:", error);
      toast.error("Không thể thêm nhà cung cấp mới");
    }
  };

  return (
    <>
      <Dialog
        open={showAddNewSupplierModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Thêm nhà cung cấp mới
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Vui lòng điền thông tin nhà cung cấp mới.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Tên:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: 	Công ty TNHH Nguyên liệu Bia Việt"
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Tên liên hệ: </strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.contactName}
                  onChange={(e) =>
                    setForm({ ...form, contactName: e.target.value })
                  }
                  placeholder="VD: Nguyễn Văn An"
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Số điện thoại:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="VD: 0909123456"
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Email:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="VD: an.nguyen@nguyenlieubia.vn"
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
                <Label className="text-base">
                  <strong>Địa chỉ:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="VD: 123 Đường Bia, Quận 1, TP.HCM"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className=""
              variant="outline"
              onClick={() => handleCreateSupplierAPI()}
            >
              <span className="d-none d-sm-inline">Thêm</span>
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
