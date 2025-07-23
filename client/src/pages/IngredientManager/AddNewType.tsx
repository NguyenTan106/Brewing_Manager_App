import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { createTypeAPI, deleteTypeAPI } from "../../services/CRUD_API_type";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
      alert("Vui lòng nhập tên loại nguyên liệu");
      return;
    }
    const newType = await createTypeAPI(typeName);
    const errorMessage = newType.message;
    if (newType.data == null) {
      alert(`${errorMessage}`);
      return;
    }
    alert(`${errorMessage}`);
    setNewTypeName("");
    handleGetAllTypesAPI();
  };

  const handleDeleteTypeAPI = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại nguyên liệu này?")) {
      const response = await deleteTypeAPI(id);
      console.log(response);
      const errorMessage = response.message;
      if (response.data == null) {
        alert(`${errorMessage}`);
        return;
      }
      alert(`${errorMessage}`);
      handleGetAllTypesAPI();
    }
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
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleDeleteTypeAPI(t.id);
                        }}
                      >
                        Xóa
                      </Button>
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
