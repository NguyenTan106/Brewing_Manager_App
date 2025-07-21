import { getAllTypesAPI } from "../../services/CRUD_API_type";
import { useState, useEffect } from "react";
import { createIngredientAPI } from "../../services/CRUD_API_Ingredient";
import { AddNewType } from "./AddNewType";
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
interface Type {
  id: number;
  typeName: string;
}
type Props = {
  handleGetAllIngredientsAPI: () => void;
  showAddIngredientModal: boolean;
  handleClose: () => void;
};

export function AddIngredient({
  handleGetAllIngredientsAPI,
  showAddIngredientModal,
  handleClose,
}: Props) {
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [type, setType] = useState<Type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    type: "",
    unit: "",
    quantity: "",
    lowStockThreshold: "",
    lastImportDate: "",
    notes: "",
  });

  useEffect(() => {
    handleGetAllTypesAPI();
  }, []);

  const handleGetAllTypesAPI = async () => {
    const data = await getAllTypesAPI();
    setType(data);
  };

  const clearForm = () => {
    setForm({
      name: "",
      type: "",
      unit: "",
      quantity: "",
      lowStockThreshold: "",
      lastImportDate: "",
      notes: "",
    });
  };

  const handleCreateIngredientAPI = async () => {
    if (
      form.name === "" ||
      form.type === "" ||
      form.unit === "" ||
      form.quantity === "" ||
      form.lowStockThreshold === "" ||
      form.lastImportDate === ""
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const data = await createIngredientAPI({
      name: form.name,
      type: form.type,
      unit: form.unit,
      quantity: parseFloat(form.quantity), // ✅ ép về number
      lowStockThreshold: parseFloat(form.lowStockThreshold),
      lastImportDate: form.lastImportDate,
      notes: form.notes,
    });
    console.log(data);
    if (data.data == null) {
      alert(data.message);
      return;
    }
    if (data.data) {
      alert(data.message);
    }

    handleGetAllIngredientsAPI();
    clearForm();
    setSelectedTypeId("");
  };

  const showModalType = () => {
    setShowTypeModal(true);
  };

  return (
    <>
      <AddNewType
        showTypeModal={showTypeModal}
        handleClose={() => setShowTypeModal(false)}
        type={type}
        handleGetAllTypesAPI={handleGetAllTypesAPI}
      />
      <Dialog
        open={showAddIngredientModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm nguyên liệu</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label>
                  <strong>Tên:</strong>
                </Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Crystal 60L"
                />
              </div>
            </div>
            <Label>
              <strong>Loại nguyên liệu: </strong>
            </Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[74%] min-w-0">
                <Select
                  value={selectedTypeId}
                  onValueChange={(value) => {
                    setSelectedTypeId(value);
                    const selected = type.find(
                      (t) => t.id.toString() === value
                    );
                    setForm((prev) => ({
                      ...prev,
                      type: selected?.typeName ?? "",
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại nguyên liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {type.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.typeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <Button variant="outline" onClick={showModalType}>
                  📚 Chi tiết
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label>
                  <strong>Số lượng:</strong>
                </Label>
                <Input
                  required
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  placeholder="VD: 20"
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label>
                  <strong>Đơn vị: </strong>
                </Label>
                <Input
                  required
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="VD: g, kg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label>
                  <strong>Giới hạn cảnh báo:</strong>
                </Label>
                <Input
                  required
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) =>
                    setForm({ ...form, lowStockThreshold: e.target.value })
                  }
                  placeholder="VD: 10"
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label>
                  <strong>Ngày nhập kho gần nhất:</strong>
                </Label>
                <Input
                  required
                  type="datetime-local"
                  value={form.lastImportDate}
                  onChange={(e) =>
                    setForm({ ...form, lastImportDate: e.target.value })
                  }
                  placeholder="VD: 2025-07-15T14:30"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
                <Label>
                  <strong>Ghi chú:</strong>
                </Label>
                <Textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="VD: 10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className=""
              variant="outline"
              onClick={() => handleCreateIngredientAPI()}
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
