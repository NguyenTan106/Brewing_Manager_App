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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết nguyên liệu</DialogTitle>
          </DialogHeader>
          <Separator />
          <>
            <p>
              <b>Thêm loại nguyên liệu mới:</b>
            </p>
            <div className="flex flex-wrap gap-4">
              <Input
                type="text"
                className="flex flex-col gap-1 w-full md:w-[48%] min-w-0"
                placeholder="Nhập tên loại nguyên liệu"
                value={newTypeName}
                onChange={(e) => {
                  setNewTypeName(e.target.value);
                }}
              />
              <Button
                className="flex flex-col gap-1  min-w-0"
                variant="secondary"
                onClick={() => handleCreateTypeAPI(newTypeName)}
              >
                <span className="d-none d-sm-inline">Thêm</span>
              </Button>
            </div>
            <h5 className="mt-3">Danh sách các loại nguyên liệu:</h5>
            <Table>
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
          </>
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
