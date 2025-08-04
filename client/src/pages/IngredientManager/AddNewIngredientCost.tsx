import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Ingredient } from "@/services/CRUD/CRUD_API_Ingredient";
import { useEffect, useState } from "react";
import { createIngredientCostAPI } from "@/services/CRUD/CRUD_API_Ingredient";
interface Props {
  showIngredientCostModal: boolean;
  handleClose: () => void;
  selectedIngredient: Ingredient | null;
  handlePaginationAPI: () => void;
}

export default function AddNewIngredientCost({
  showIngredientCostModal,
  handleClose,
  selectedIngredient,
  handlePaginationAPI,
}: Props) {
  const [ingredientCostForm, setIngredientCostForm] = useState({
    ingredientId: 0,
    cost: "",
    note: "",
  });

  useEffect(() => {
    if (selectedIngredient)
      setIngredientCostForm({
        ingredientId: Number(selectedIngredient.id),
        cost: "",
        note: "",
      });
  }, [selectedIngredient]);

  const clearForm = () => {
    setIngredientCostForm({
      ingredientId: Number(selectedIngredient?.id),
      cost: "",
      note: "",
    });
  };

  const handleCreateIngredientCostAPI = async () => {
    if (ingredientCostForm.cost === "") {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const newCost = await createIngredientCostAPI(ingredientCostForm);
    if (newCost.data == null) {
      toast.error(newCost.message);
      return;
    }
    if (newCost.data) {
      toast.success(newCost.message, {
        description: new Date().toLocaleTimeString(),
      });
    }
    clearForm();
    handlePaginationAPI();
    handleClose();
  };

  return (
    <>
      <Dialog
        open={showIngredientCostModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Thay đổi giá nhập
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Thay đổi giá nhập mới cho nguyên liệu
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="grid gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>ID:</strong>
                </Label>
                {selectedIngredient?.id}
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Nguyên liệu:</strong>
                </Label>
                {selectedIngredient?.name}
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Giá nhập cũ:</strong>
                </Label>
                <Input
                  style={{
                    fontSize: "0.95rem",
                    backgroundColor: "gray",
                    fontWeight: "bold",
                  }}
                  disabled
                  type="number"
                  value={selectedIngredient?.cost}
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Giá nhập mới:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  type="number"
                  value={ingredientCostForm.cost}
                  onChange={(e) =>
                    setIngredientCostForm({
                      ...ingredientCostForm,
                      cost: e.target.value,
                    })
                  }
                  placeholder="VD: 200 VNĐ"
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
                <Label className="text-base">
                  <strong>Ghi chú:</strong>
                </Label>
                <Textarea
                  style={{ fontSize: "0.95rem" }}
                  rows={4}
                  value={ingredientCostForm.note}
                  onChange={(e) =>
                    setIngredientCostForm({
                      ...ingredientCostForm,
                      note: e.target.value,
                    })
                  }
                  placeholder="VD: Malt nền cho nhiều loại bia, màu sáng, vị ngũ cốc nhẹ"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose className="flex gap-3" asChild>
              <div>
                <Button
                  className=""
                  variant="outline"
                  onClick={() => handleCreateIngredientCostAPI()}
                >
                  <span className="d-none d-sm-inline">
                    Thay đổi giá nhập mới
                  </span>
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Đóng
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
