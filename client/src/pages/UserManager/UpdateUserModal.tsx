import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { User } from "@/services/CRUD/CRUD_API_User";
import { useEffect, useState } from "react";
import { updateUserByIdAPI } from "@/services/CRUD/CRUD_API_User";
interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  selectedUser: User | null;
  handleGetAllUserAPI: () => void;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function UpdateUserModal({
  handleGetAllUserAPI,
  showUpdateModal,
  handleClose,
  selectedUser,
  setSelectedUser,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<User>>({});
  useEffect(() => {
    if (selectedUser) setEditForm(selectedUser);
  }, [selectedUser]);

  const handleUpdateUserById = async (id: number) => {
    if (
      editForm.username === "" ||
      //   form.role === ("" as Role) ||
      editForm.phone === ""
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const data = await updateUserByIdAPI(id, editForm);
    if (data.data == null) {
      toast.error(data.message);
      return;
    }
    if (data.data) {
      toast.success(data.message);
    }
    handleGetAllUserAPI();
    setSelectedUser(data.data);
    handleClose();
  };
  return (
    <>
      <Dialog
        open={showUpdateModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold ">
              Sửa người dùng {selectedUser?.username}
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <p>
              <strong>ID:</strong> {selectedUser?.id}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Tên người dùng:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  placeholder="VD: admin123"
                  value={editForm?.username ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Vai trò:</strong>
                </Label>
                <Input
                  disabled
                  value={editForm?.role ?? ""}
                  // onChange={(e) =>
                  //   setEditForm({ ...editForm, role: e.target.value })
                  // }
                  style={{ fontSize: "0.95rem" }}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Số điện thoại:</strong>
                </Label>
                <Input
                  placeholder="VD: 0942510317"
                  value={editForm?.phone ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  style={{ fontSize: "0.95rem" }}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Chi nhánh:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  placeholder="VD: Thủ Đức"
                  value={editForm?.branch ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      branch: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="secondary"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() =>
                selectedUser?.id && handleUpdateUserById(selectedUser?.id)
              }
              style={{
                padding: "5px 10px",
              }}
            >
              ✏️ <span className="d-none d-sm-inline">Cập nhật</span>
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
