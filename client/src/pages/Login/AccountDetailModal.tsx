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
import { toast } from "sonner";
import type { User } from "@/services/CRUD/CRUD_API_User";
import { PencilLine } from "lucide-react"; // icon đẹp hơn

interface Props {
  showDetailAccountModal: boolean;
  handleClose: () => void;
  selectedUser: User | null;
  handleShowUpdateModal: () => void; // thêm props này
}

export default function AccountDetailModal({
  showDetailAccountModal,
  handleClose,
  selectedUser,
  handleShowUpdateModal,
}: Props) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Chưa có";
    return new Date(dateStr).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayField = (value?: string | number | null) =>
    value ? String(value) : "Chưa có";

  return (
    <Dialog
      open={showDetailAccountModal}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[440px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Tài khoản
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Chi tiết về tài khoản hiện tại.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />
        <div className="grid gap-6 pt-2">
          {/* Thông tin cá nhân */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="ID" value={displayField(selectedUser?.id)} />
              <Info
                label="Tên tài khoản"
                value={displayField(selectedUser?.username)}
              />
              <Info
                label="Số điện thoại"
                value={displayField(selectedUser?.phone)}
              />
              <Info label="Email" value="Chưa có" />
              <Info label="Họ tên" value="Chưa có" />
              <Info label="Sinh nhật" value="Chưa có" />
            </div>
          </div>

          <Separator />

          {/* Thông tin hệ thống */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Thông tin hệ thống
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info
                label="Chi nhánh"
                value={displayField(selectedUser?.branch)}
              />
              <Info label="Số mẻ đã tạo" value="Chưa có" />
              <Info label="Vai trò" value={displayField(selectedUser?.role)} />
              <Info
                label="Ngày tạo"
                value={formatDate(selectedUser?.createdAt)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="secondary"
            className="bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-1"
            onClick={handleShowUpdateModal}
          >
            <PencilLine className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium text-gray-900">{value}</p>
    </div>
  );
}
