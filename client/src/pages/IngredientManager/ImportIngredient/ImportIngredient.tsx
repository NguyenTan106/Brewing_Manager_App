import { useEffect, useState } from "react";
import {
  importIngredientAPI,
  type ImportIngredient,
} from "@/services/CRUD_API_IngredientImport";
import type { Ingredient } from "@/services/CRUD_API_Ingredient";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  showImportIngredientModal: boolean;
  handleClose: () => void;
  selectedIngredient: Ingredient | null;
  handlePaginationAPI: () => Promise<void>;
}

export function ImportIngredient({
  showImportIngredientModal,
  handleClose,
  selectedIngredient,
  handlePaginationAPI,
}: Props) {
  const [importIngredientForm, setImportIngredientForm] = useState({
    ingredientId: "",
    amount: "",
    notes: "",
  });

  useEffect(() => {
    if (selectedIngredient?.id) {
      setImportIngredientForm((prev) => ({
        ...prev,
        ingredientId: selectedIngredient?.id.toString(),
      }));
    }
  }, [selectedIngredient]);

  const handleImportIngredientAPI = async () => {
    if (
      importIngredientForm?.ingredientId === "" ||
      importIngredientForm?.amount === ""
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const imported = await importIngredientAPI({
      ingredientId: importIngredientForm?.ingredientId,
      amount: importIngredientForm?.amount,
      notes: importIngredientForm?.notes,
    });
    if (imported.data == null) {
      toast.error(imported.message);
      return;
    }
    if (imported.data) {
      toast.success(imported.message, {
        description: new Date().toLocaleTimeString(),
      });
    }
    await handlePaginationAPI();
  };

  return (
    <Dialog
      open={showImportIngredientModal}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Nhập kho nguyên liệu
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Nhập thêm nguyên liệu vào kho
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="grid gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
              <Label className="text-base">
                <strong>ID:</strong>
              </Label>
              {importIngredientForm.ingredientId}
            </div>
            <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
              <Label className="text-base">
                <strong>Tên:</strong>
              </Label>
              {selectedIngredient?.name}
            </div>
            <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
              <Label className="text-base">
                <strong>Số lượng:</strong>
              </Label>
              <Input
                style={{ fontSize: "0.95rem" }}
                required
                type="number"
                value={importIngredientForm.amount}
                onChange={(e) =>
                  setImportIngredientForm({
                    ...importIngredientForm,
                    amount: e.target.value,
                  })
                }
                placeholder="VD: 20"
              />
            </div>

            <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
              <Label className="text-base">
                <strong>Ghi chú:</strong>
              </Label>
              <Textarea
                style={{ fontSize: "0.95rem" }}
                rows={4}
                placeholder="VD: Malt nền cho nhiều loại bia, màu sáng, vị ngũ cốc nhẹ"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose className="flex gap-3">
            <Button
              className=""
              variant="outline"
              onClick={() => handleImportIngredientAPI()}
            >
              <span className="d-none d-sm-inline">Thêm</span>
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
