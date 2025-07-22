import { useState, useEffect } from "react";
import { updateIngredientByIdAPI } from "../../services/CRUD_API_Ingredient";
import { type Ingredient } from "../../services/CRUD_API_Ingredient";
// import Select from "react-select";
import { getAllTypesAPI } from "../../services/CRUD_API_type";
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
type Props = {
  handleClose: () => void;
  selectedIngredient: Ingredient | null;
  showUpdateModal: boolean;
  handleGetAllIngredientsAPI: () => void;
  handlePaginationAPI: () => void;
};

export interface Type {
  id: number;
  typeName: string;
}

export default function IngredientUpdateModal({
  handleClose,
  selectedIngredient,
  showUpdateModal,
  // handleGetAllIngredientsAPI,
  handlePaginationAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<Ingredient>>({});
  const [type, setType] = useState<Type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");

  useEffect(() => {
    if (selectedIngredient) {
      setEditForm(selectedIngredient);

      const matchedType = type.find(
        (t) => t.typeName === selectedIngredient.type
      );

      if (matchedType) {
        setSelectedTypeId(matchedType.id.toString());
      }
    }
  }, [selectedIngredient, type]);

  useEffect(() => {
    handleGetAllTypesAPI();
    if (selectedIngredient) {
      setEditForm(selectedIngredient);
    }
  }, [selectedIngredient]);

  const handleGetAllTypesAPI = async () => {
    const data = await getAllTypesAPI();
    setType(data);
  };

  const handleUpdateIngredientByIdAPI = async (id: number | undefined) => {
    if (!id) return;
    try {
      if (
        editForm.name === "" ||
        editForm.type === "" ||
        editForm.unit === "" ||
        editForm.quantity === "" ||
        editForm.lowStockThreshold === "" ||
        editForm.lastImportDate === null
      ) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      if (
        selectedIngredient?.quantity == editForm.quantity &&
        selectedIngredient?.lowStockThreshold == editForm.lowStockThreshold &&
        selectedIngredient?.lastImportDate == editForm.lastImportDate &&
        selectedIngredient?.name == editForm.name &&
        selectedIngredient?.type == editForm.type &&
        selectedIngredient?.unit == editForm.unit &&
        selectedIngredient?.notes == editForm.notes
      ) {
        alert("Không có thay đổi nào để cập nhật");
        return;
      }
      await updateIngredientByIdAPI(id, editForm);

      handleClose();
      // handleGetAllIngredientsAPI();
      handlePaginationAPI();
      alert("Thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật nguyên liệu:", err);
      alert("Lỗi khi cập nhật nguyên liệu");
    }
  };

  const toDatetimeLocalValue = (dateString: string) => {
    const date = new Date(dateString); // ISO string từ DB
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const fromDatetimeLocalValue = (value: string) => {
    if (!value || isNaN(Date.parse(value))) {
      console.warn("Giá trị ngày giờ không hợp lệ:", value);
      return null;
    }
    const date = new Date(value);
    return date.toISOString();
  };

  return (
    <>
      <Dialog
        open={showUpdateModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <form>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold ">
                Sửa nguyên liệu: {selectedIngredient?.name}
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="grid gap-4">
              <Label className="text-base">
                <strong>ID:</strong> {selectedIngredient?.id}
              </Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0 ">
                  <Label className="text-base">
                    <strong>Tên:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    placeholder="VD: Crystal 60L"
                    value={editForm?.name ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Loại:</strong>
                  </Label>
                  <Select
                    value={selectedTypeId}
                    onValueChange={(value) => {
                      setSelectedTypeId(value);
                      const selected = type.find(
                        (t) => t.id.toString() === value
                      );
                      setEditForm((prev) => ({
                        ...prev,
                        type: selected?.typeName ?? "",
                      }));
                    }}
                  >
                    <SelectTrigger
                      style={{ fontSize: "0.95rem" }}
                      className="w-full"
                    >
                      <SelectValue placeholder="Chọn loại nguyên liệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {type.map((t) => (
                        <SelectItem
                          style={{ fontSize: "0.95rem" }}
                          key={t.id}
                          value={t.id.toString()}
                        >
                          {t.typeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Đơn vị:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    placeholder="VD: g"
                    value={editForm?.unit ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, unit: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Số lượng:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    type="number"
                    placeholder="VD: 20"
                    value={editForm?.quantity ?? ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        quantity:
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Giới hạn cảnh báo:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    type="number"
                    placeholder="VD: 20"
                    value={editForm?.lowStockThreshold ?? ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        lowStockThreshold:
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Ngày nhập kho gần nhất:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    type="datetime-local"
                    value={
                      editForm?.lastImportDate
                        ? toDatetimeLocalValue(editForm.lastImportDate)
                        : ""
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        lastImportDate: fromDatetimeLocalValue(e.target.value),
                      })
                    }
                    placeholder="VD: 2025-07-15T14:30"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
                  <Label className="text-base font-bold">Ghi chú:</Label>
                  <Textarea
                    style={{ fontSize: "0.95rem" }}
                    placeholder="Nhập ghi chú..."
                    value={editForm?.notes ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={4} // có thể chỉnh số dòng
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() =>
                  handleUpdateIngredientByIdAPI(selectedIngredient?.id)
                }
                style={{
                  padding: "5px 10px",
                }}
              >
                ✏️ <span className="d-none d-sm-inline">Cập nhật</span>
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Huỷ</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
