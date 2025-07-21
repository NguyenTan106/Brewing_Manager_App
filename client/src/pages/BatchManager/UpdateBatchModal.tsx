import { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import type { Batch, Status } from "../../services/CRUD_API_Batch";
import { updateBatchByIdAPI } from "../../services/CRUD_API_Batch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  handleGetAllBatchesAPI: () => Promise<void>;
  selectedBatch: Batch | null;
  statusOptions: { label: string; value: Status }[];
  setSelectedBatch: React.Dispatch<React.SetStateAction<Batch | null>>;
  handlePaginationAPI: () => void;
}

export default function UpdateBatchModal({
  showUpdateModal,
  setSelectedBatch,
  handleClose,
  selectedBatch,
  statusOptions,
  handlePaginationAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Batch>>({});
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    value: Status;
  } | null>(null);
  const handleUpdateBatchByIdAPI = async (id: number) => {
    if (!id) return;
    try {
      if (
        editForm.beerName === "" ||
        editForm.status === ("" as Status) ||
        editForm.notes === ""
      ) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      if (
        selectedBatch?.beerName == editForm.beerName &&
        selectedBatch?.status == editForm.status &&
        selectedBatch?.notes == editForm.notes
      ) {
        alert("Không có thay đổi nào để cập nhật");
        return;
      }
      const data = await updateBatchByIdAPI(id, editForm);
      handleClose();
      handlePaginationAPI();
      setSelectedBatch(data.data);
    } catch (err) {
      console.error("Lỗi khi cập nhật mẻ:", err);
      alert("Lỗi khi cập nhật mẻ");
    }
  };

  useEffect(() => {
    if (editForm.status) {
      const found = statusOptions.find((opt) => opt.value === editForm.status);
      if (found) setSelectedStatus(found);
      else setSelectedStatus(null);
    } else {
      setSelectedStatus(null);
    }
  }, [editForm.status, statusOptions]);

  useEffect(() => {
    if (selectedBatch) {
      setEditForm(selectedBatch);
    }
  }, [selectedBatch]);

  return (
    <>
      <Dialog
        open={showUpdateModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Sửa nguyên liệu {selectedBatch?.beerName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <p>
              <strong>ID:</strong> {selectedBatch?.id}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Tên mẻ:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  placeholder="VD: Crystal 60L"
                  value={editForm?.beerName ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, beerName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Trạng thái:</strong>
                </Label>
                <Select
                  value={editForm.status ?? ""}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, status: value as Status })
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem
                        style={{ fontSize: "0.95rem" }}
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Công thức: </strong>
                </Label>
                <Input
                  style={{
                    fontSize: "0.95rem",
                    backgroundColor: "gray",
                    fontWeight: "bold",
                  }}
                  disabled
                  placeholder="VD: g"
                  value={editForm?.recipe?.name ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Khối lượng mẻ (lít):</strong>
                </Label>
                <Input
                  disabled
                  style={{
                    fontSize: "0.95rem",
                    backgroundColor: "gray",
                    fontWeight: "bold",
                  }}
                  placeholder="VD: g"
                  value={editForm?.volume ?? ""}
                />
              </div>
            </div>
            <div>
              <Label className="text-base">
                <strong>Ghi chú:</strong>
              </Label>
              <Textarea
                style={{ fontSize: "0.95rem" }}
                rows={4}
                placeholder="VD: 20"
                value={editForm?.notes ?? ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    notes: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className=""
              variant="outline"
              onClick={() =>
                selectedBatch?.id && handleUpdateBatchByIdAPI(selectedBatch?.id)
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
