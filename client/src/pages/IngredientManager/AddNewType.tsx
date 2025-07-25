import { useState } from "react";
import { createTypeAPI, deleteTypeAPI } from "../../services/CRUD_API_type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  showTypeModal: boolean;
  handleClose: () => void;
  type: { id: number; typeName: string }[];
  handleGetAllTypesAPI: () => void;
};
export function AddNewType({
  showTypeModal,
  handleClose,
  type,
  handleGetAllTypesAPI,
}: Props) {
  const [newTypeName, setNewTypeName] = useState("");

  const handleCreateTypeAPI = async (typeName: string) => {
    if (typeName.trim() === "") {
      toast.warning("Vui lòng nhập tên loại nguyên liệu");
      return;
    }
    const newType = await createTypeAPI(typeName);
    const errorMessage = newType.message;
    if (newType.data == null) {
      toast.error(`${errorMessage}`);
      return;
    }
    toast.success(`${errorMessage}`);
    setNewTypeName("");
    handleGetAllTypesAPI();
  };

  const handleDeleteTypeAPI = async (id: number) => {
    const response = await deleteTypeAPI(id);
    console.log(response);
    const errorMessage = response.message;
    if (response.data == null) {
      toast.error(`${errorMessage}`);
      return;
    }
    toast.success(`${errorMessage}`);
    handleGetAllTypesAPI();
  };
  return (
    <>
      <Dialog
        open={showTypeModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết loại
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết về các loại nguyên liệu.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-2">
            <Label className="text-base">
              <b>Thêm loại nguyên liệu mới:</b>
            </Label>
            <div className="flex flex-wrap gap-2">
              <Input
                style={{ fontSize: "0.95rem" }}
                type="text"
                className="flex flex-col gap-1 w-full md:w-[48%] min-w-0"
                placeholder="Nhập tên loại nguyên liệu"
                value={newTypeName}
                onChange={(e) => {
                  setNewTypeName(e.target.value);
                }}
              />
              <Button
                style={{ fontSize: "0.95rem" }}
                className="flex flex-col gap-1 min-w-0"
                onClick={() => handleCreateTypeAPI(newTypeName)}
              >
                <span className="d-none d-sm-inline">Thêm</span>
              </Button>
            </div>
            <Label className="mt-3 text-lg">
              Danh sách các loại nguyên liệu:
            </Label>
            <Table className="text-base">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên loại</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {type.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.typeName}</TableCell>
                    <TableCell style={{ width: "25%" }}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Xóa</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Bạn có chắc muốn xóa loại nguyên liệu này?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Nguyên liệu này sẽ bị xóa vĩnh viễn
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                handleDeleteTypeAPI(t.id);
                              }}
                            >
                              Xác nhận
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
