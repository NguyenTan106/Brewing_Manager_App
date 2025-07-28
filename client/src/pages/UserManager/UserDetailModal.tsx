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
import type { User } from "@/services/CRUD/CRUD_API_User";
import UpdateUserModal from "./UpdateUserModal";
import { useState } from "react";
import { deleteUserByIdAPI } from "@/services/CRUD/CRUD_API_User";
import { checkUser } from "@/components/Auth/Check";
interface Props {
  showDetailModal: boolean;
  handleClose: () => void;
  selectedUser: User | null;
  handleGetAllUserAPI: () => void;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function UserDetailModal({
  showDetailModal,
  handleClose,
  selectedUser,
  handleGetAllUserAPI,
  setSelectedUser,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const currentUserId = checkUser();
  const handleDeteleUserById = async (id: number, currentUserId: number) => {
    const data = await deleteUserByIdAPI(id, currentUserId);
    if (data.data == null || data.data.length === 0) {
      toast.error(data.message);
      return;
    }
    console.log(data.data);
    if (data.data) {
      toast.success("Thành công");
    }
    handleGetAllUserAPI();
    handleClose();
  };

  const handleShowUpdateModal = () => {
    setShowUpdateModal(true);
  };

  return (
    <>
      <UpdateUserModal
        showUpdateModal={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        selectedUser={selectedUser}
        handleGetAllUserAPI={handleGetAllUserAPI}
        setSelectedUser={setSelectedUser}
      />
      <Dialog
        open={showDetailModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[400px] md:max-w-[500px]   max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết người dùng
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết về người dùng hiện tại.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">{selectedUser?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tên người dùng</p>
                <p className="text-base font-medium">
                  {selectedUser?.username}
                </p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Vai trò</p>
                <p className="text-base">{selectedUser?.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="text-base">{selectedUser?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chi nhánh</p>
                <p className="text-base">{selectedUser?.branch || "Chưa có"}</p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="text-base">
                  {selectedUser?.createdAt &&
                    new Date(selectedUser.createdAt).toLocaleString("vi-VN", {
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
                      handleDeteleUserById(
                        selectedUser?.id ?? 0,
                        currentUserId?.id ?? 0
                      )
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
