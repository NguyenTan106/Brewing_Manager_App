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
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import type { User } from "@/services/CRUD/CRUD_API_User";

interface Props {
  showDetailAccountModal: boolean;
  handleClose: () => void;
  selectedUser: User | null;
}

export default function AccountDetailModal({
  showDetailAccountModal,
  handleClose,
  selectedUser,
}: Props) {
  return (
    <>
      <Dialog
        open={showDetailAccountModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[440px] md:max-w-[600px]   max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Tài khoản
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết về tài khoản hiện tại.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4 pt-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">{selectedUser?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tên tài khoản</p>
                <p className="text-base font-medium">
                  {selectedUser?.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="text-base">{selectedUser?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base">Chưa có</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Họ tên</p>
                <p className="text-base">
                  {/* {selectedUser?.username} */} Chưa có
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sinh nhật</p>
                <p className="text-base">
                  {/* {selectedUser?.username} */} Chưa có
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chi nhánh</p>
                <p className="text-base">{selectedUser?.branch || "Chưa có"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số mẻ đã tạo</p>
                <p className="text-base">{selectedUser?.branch || "Chưa có"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vai trò</p>
                <p className="text-base">{selectedUser?.role}</p>
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

          <DialogFooter className="mt-2">
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
              <AlertDialogTrigger asChild></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn có chắc muốn xóa nguyên liệu này?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Công thức này sẽ bị đưa vào mục đã xóa, các liên kết của
                    công thức này vẫn được giữ nguyên.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                  // onClick={() =>
                  //   selectedRecipe?.id &&
                  //   handleDeleteRecipeByIdAPI(selectedRecipe?.id)
                  // }
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
