import { useState } from "react";
import { Modal, Col, Form } from "react-bootstrap";
import { createRecipeAPI } from "../../services/CRUD_API_Recipe";
import type { Ingredient } from "../../services/CRUD_API_Ingredient";
import { type RecipeIngredientInput } from "../../services/CRUD_API_Recipe";
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
import { FaPlus } from "react-icons/fa";

interface Props {
  showAddModal: boolean;
  handleClose: () => void;
  ingredients: Ingredient[];
  handlePaginationAPI: () => void;
}

export default function AddNewRecipeModal({
  showAddModal,
  handleClose,
  handlePaginationAPI,
  ingredients,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    note: "",
    instructions: "",
    recipeIngredients: [] as RecipeIngredientInput[],
  });

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      note: "",
      instructions: "",
      recipeIngredients: [],
    });
  };

  const handleCreateRecipeAPI = async () => {
    if (
      form.name === "" ||
      form.description === "" ||
      form.note === "" ||
      form.instructions === "" ||
      form.recipeIngredients.length === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const data = await createRecipeAPI(form);
    if (data.data == null) {
      alert(data.message);
      return;
    }
    if (data.data) {
      alert(data.message);
    }
    clearForm();
    handlePaginationAPI();
  };

  const options = ingredients.map((ing) => ({
    value: ing.id,
    label: ing.name,
  }));

  return (
    <>
      <Dialog
        open={showAddModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[640px] md:max-w-[700px]   max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Thêm công thức
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
                  <strong>Tên công thức:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Công thức IPA đậm vị"
                />
              </div>
              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label className="text-base">
                  <strong>Mô tả: </strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="VD: g, kg"
                />
              </div>
              <div className="flex flex-col gap-0 w-full min-w-0 mt-3">
                <div className="flex justify-between items-center flex-wrap ">
                  <Label className="text-lg font-bold">
                    <>Chọn nguyên liệu: </>
                  </Label>
                  <Button
                    style={{ fontSize: "0.95rem" }}
                    className="mb-3 al"
                    onClick={() =>
                      setForm({
                        ...form,
                        recipeIngredients: [
                          ...form.recipeIngredients,
                          { ingredientId: "", amountNeeded: "" },
                        ],
                      })
                    }
                  >
                    <FaPlus /> Thêm nguyên liệu
                  </Button>
                </div>
                <Separator />
                <Table className="text-base">
                  <TableCaption>- - - Thêm nguyên liệu - - -</TableCaption>
                  <TableHeader className="">
                    <TableRow>
                      <TableHead>Nguyên liệu</TableHead>
                      <TableHead>Lượng cần dùng</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Đơn vị</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.recipeIngredients.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              onValueChange={(value) => {
                                const updated = [...form.recipeIngredients];
                                const target = updated[index];
                                if (target) {
                                  target.ingredientId = value;
                                  setForm({
                                    ...form,
                                    recipeIngredients: updated,
                                  });
                                }
                              }}
                              value={
                                form.recipeIngredients[index]?.ingredientId ||
                                ""
                              }
                            >
                              <SelectTrigger
                                className="w-full"
                                style={{ fontSize: "0.95rem" }}
                              >
                                <SelectValue placeholder="Chọn nguyên liệu" />
                              </SelectTrigger>
                              <SelectContent>
                                {options.map((opt) => (
                                  <SelectItem
                                    style={{ fontSize: "0.95rem" }}
                                    key={opt.value}
                                    value={opt.value.toString()}
                                  >
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              style={{ fontSize: "0.95rem" }}
                              type="number"
                              placeholder="Số lượng"
                              value={item.amountNeeded}
                              onChange={(e) => {
                                const updated = [...form.recipeIngredients];
                                const target = updated[index];
                                if (target) {
                                  target.amountNeeded = e.target.value;
                                  setForm({
                                    ...form,
                                    recipeIngredients: updated,
                                  });
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="align-middle">
                            {ingredients.find(
                              (ing) => ing.id === Number(item.ingredientId)
                            )?.type || "-"}
                          </TableCell>
                          <TableCell className="align-middle">
                            {ingredients.find(
                              (ing) => ing.id === Number(item.ingredientId)
                            )?.unit || "-"}
                          </TableCell>

                          <TableCell className="align-middle">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updated = form.recipeIngredients.filter(
                                  (_, i) => i !== index
                                );
                                setForm({
                                  ...form,
                                  recipeIngredients: updated,
                                });
                              }}
                            >
                              X
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label className="text-base">
                  <strong>Ghi chú:</strong>
                </Label>
                <Textarea
                  style={{ fontSize: "0.95rem" }}
                  required
                  rows={2}
                  value={form.note}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      note: e.target.value,
                    })
                  }
                  placeholder="VD: Thêm dry hopping sau 5 ngày"
                />
              </div>
              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label className="text-base">
                  <strong>Các bước thực hiện:</strong>
                </Label>
                <Textarea
                  style={{ fontSize: "0.95rem" }}
                  required
                  rows={4}
                  value={form.instructions}
                  onChange={(e) =>
                    setForm({ ...form, instructions: e.target.value })
                  }
                  placeholder="VD: Ủ trong 5 ngày ở 20°C. Lên men bằng men T-58."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className=""
              variant="primary"
              onClick={() => handleCreateRecipeAPI()}
            >
              <span className="d-sm-inline">Thêm</span>
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
