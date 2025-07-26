import { getAllTypesAPI } from "../../services/CRUD_API_type";
import { useState, useEffect } from "react";
import { createIngredientAPI } from "../../services/CRUD_API_Ingredient";
import { AddNewType } from "./AddNewType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { toast } from "sonner";

interface Type {
  id: number;
  typeName: string;
}
type Props = {
  handlePaginationAPI: () => void;
  showAddIngredientModal: boolean;
  handleClose: () => void;
};

export function AddIngredient({
  handlePaginationAPI,
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
      toast.warning("Vui lòng điền đầy đủ thông tin");
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
    if (data.data == null) {
      toast.error(data.message);
      return;
    }
    if (data.data) {
      toast.success(data.message, {
        description: new Date().toLocaleTimeString(),
      });
    }

    handlePaginationAPI();
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
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Thêm nguyên liệu
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Những thông tin cần thêm
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label className="text-base">
                  <strong>Tên:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Crystal 60L"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              <Label className="text-base">
                <strong>Loại nguyên liệu: </strong>
              </Label>
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
                  <SelectTrigger
                    className="w-full"
                    style={{ fontSize: "0.95rem" }}
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
              <div className="flex flex-col gap-1 min-w-0 ml-3">
                <Button variant="outline" onClick={showModalType}>
                  📚 Chi tiết
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[41%] min-w-0">
                <Label className="text-base">
                  <strong>Đơn vị: </strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="VD: g, kg"
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[55%] min-w-0">
                <Label className="text-base">
                  <strong>Số lượng:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  placeholder="VD: 20"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[41%] min-w-0">
                <Label className="text-base">
                  <strong>Giới hạn cảnh báo:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) =>
                    setForm({ ...form, lowStockThreshold: e.target.value })
                  }
                  placeholder="VD: 10"
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[55%] min-w-0">
                <Label className="text-base">
                  <strong>Ngày nhập kho gần nhất:</strong>
                </Label>
                <Input
                  className="grid"
                  style={{ fontSize: "0.95rem" }}
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
                <Label className="text-base">
                  <strong>Ghi chú:</strong>
                </Label>
                <Textarea
                  style={{ fontSize: "0.95rem" }}
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="VD: Malt nền cho nhiều loại bia, màu sáng, vị ngũ cốc nhẹ"
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
