import { useState } from "react";
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
import { createNewUserAPI, Role } from "@/services/CRUD/CRUD_API_User";

interface Props {
  showAddNewUserModal: boolean;
  handleClose: () => void;
  handleGetAllUserAPI: () => void;
}
export default function AddNewUserModal({
  showAddNewUserModal,
  handleClose,
  handleGetAllUserAPI,
}: Props) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "ADMIN" as Role,
    phone: "",
    branch: "",
  });

  const clearForm = () => {
    setForm({
      username: "",
      password: "",
      role: "ADMIN" as Role,
      phone: "",
      branch: "",
    });
  };

  const handleCreateNewUserAPI = async () => {
    if (
      form.username === "" ||
      form.password === "" ||
      //   form.role === ("" as Role) ||
      form.phone === ""
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const data = await createNewUserAPI(form);
    if (data.data == null) {
      toast.error(data.message);
      return;
    }
    if (data.data) {
      toast.success(data.message);
    }
    clearForm();
    handleGetAllUserAPI();
    handleClose();
  };
  return (
    <>
      <Dialog
        open={showAddNewUserModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Thêm người dùng
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Những thông tin cần thêm
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Tên người dùng:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  placeholder="VD: admin1"
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Mật khẩu: </strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="VD: admin123"
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Vai trò:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  disabled
                  value={form.role}
                  //   onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="VD: 20"
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
                  placeholder="VD: 0942510317"
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Chi nhánh:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="VD: Tây Ninh"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-3">
            <Button
              className=""
              variant="outline"
              onClick={() => handleCreateNewUserAPI()}
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
