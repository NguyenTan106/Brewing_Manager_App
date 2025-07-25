import { useState, useEffect } from "react";
import type { RecipeUpate } from "../../services/CRUD_API_Recipe";
import { updateRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
import { type RecipeIngredient } from "../../services/CRUD_API_Recipe";
import type { Ingredient } from "../../services/CRUD_API_Ingredient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import mammoth from "mammoth";
import TurndownService from "turndown";
import { toast } from "sonner";

interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  selectedRecipe: RecipeUpate | null;
  handlePaginationAPI: () => void;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<RecipeUpate | null>>;
  selectedRecipeIngredient: RecipeIngredient[] | null;
  setSelectedRecipeIngredient: React.Dispatch<
    React.SetStateAction<RecipeIngredient[] | null>
  >;
  ingredients: Ingredient[];
}

export default function UpdateRecipeModal({
  showUpdateModal,
  handleClose,
  selectedRecipe,
  setSelectedRecipe,
  handlePaginationAPI,
  selectedRecipeIngredient,
  setSelectedRecipeIngredient,
  ingredients,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<RecipeUpate>>({});

  useEffect(() => {
    if (selectedRecipe) {
      setEditForm(selectedRecipe);
    }
  }, [selectedRecipe]);

  useEffect(() => {
    if (showUpdateModal && selectedRecipe && selectedRecipeIngredient) {
      setEditForm({
        name: selectedRecipe.name || "",
        description: selectedRecipe.description || "",
        note: selectedRecipe.note || "",
        instructions: selectedRecipe.instructions || "",
        recipeIngredients: selectedRecipeIngredient.map((ri) => ({
          id: ri.id,
          ingredient: ri.ingredient,
          ingredientId: ri.ingredient.id,
          amountNeeded: ri.amountNeeded,
        })),
      });
    }
  }, [showUpdateModal, selectedRecipe, selectedRecipeIngredient]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();

      // B1: Chuyển docx → HTML
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

      // B2: Chuyển HTML → Markdown
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(html);

      // B3: Gán vào form
      setEditForm((prev) => ({
        ...prev,
        instructions: markdown,
      }));
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      toast.error("Không thể đọc file Word. Vui lòng thử lại.");
    }
  };

  const handleUpdateRecipeByIdAPI = async (id: number) => {
    if (!id) return;
    try {
      if (
        editForm.name === "" ||
        !editForm.recipeIngredients ||
        (Array.isArray(editForm.recipeIngredients) &&
          editForm.recipeIngredients.length === 0) ||
        editForm.description === "" ||
        editForm.note === "" ||
        editForm.instructions === ""
      ) {
        toast.warning("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      // console.log(selectedRecipe?.recipeIngredients.map((i) => i.amountNeeded));
      console.log();

      console.log();
      if (
        selectedRecipe?.name == editForm.name &&
        selectedRecipe?.description == editForm.description &&
        selectedRecipe?.instructions == editForm.instructions &&
        selectedRecipe?.note == editForm.note &&
        JSON.stringify(
          editForm.recipeIngredients.map((i) => i.amountNeeded)
        ) ===
          JSON.stringify(
            selectedRecipe?.recipeIngredients.map((i) => i.amountNeeded)
          ) &&
        JSON.stringify(
          editForm.recipeIngredients.map((i) => i.ingredientId)
        ) ===
          JSON.stringify(
            selectedRecipe?.recipeIngredients.map((i) => i.ingredientId)
          )
      ) {
        toast.warning("Không có thay đổi nào để cập nhật");
        return;
      }
      const data = await updateRecipeByIdAPI(id, editForm);
      toast.success("Cập nhật công thức thành công");
      handleClose();
      handlePaginationAPI();
      setSelectedRecipe(data.data);
      setSelectedRecipeIngredient(data.data.recipeIngredients);
    } catch (err) {
      console.error("Lỗi khi cập nhật mẻ:", err);
      toast.error("Lỗi khi cập nhật mẻ");
    }
  };

  const options = ingredients.map((ing) => ({
    value: ing.id,
    label: ing.name,
  }));

  return (
    <>
      <Dialog
        open={showUpdateModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold ">
              Sửa công thức {selectedRecipe?.name}
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <p>
              <strong>ID:</strong> {selectedRecipe?.id}
            </p>
            <div>
              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label className="text-base">
                  <strong>Tên công thức:</strong>
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
            </div>
            <div className="flex flex-col gap-1 w-full min-w-0">
              <div className="flex justify-between items-center flex-wrap ">
                <Label className="text-base self-end">
                  <strong>Nguyên liệu cần dùng:</strong>
                </Label>
                <Button
                  style={{
                    fontSize: "15px",
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition"
                  onClick={() => {
                    setEditForm({
                      ...editForm,
                      recipeIngredients: [
                        ...(editForm.recipeIngredients ?? []),
                        {
                          ingredientId: "",
                          amountNeeded: "",
                          ingredient: { id: 0, name: "", unit: "" },
                        },
                      ],
                    });
                  }}
                >
                  <FaPlus /> Thêm nguyên liệu
                </Button>
              </div>
              <Separator className="my-1" />
              <Table className="text-base">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Số lượng cần</TableHead>
                    <TableHead>Đơn vị</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editForm.recipeIngredients &&
                  editForm.recipeIngredients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted">
                        <p>Không có nguyên liệu</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    editForm.recipeIngredients?.map((e, index) => {
                      return (
                        <TableRow key={e.ingredient.id}>
                          <TableCell className="align-middle">
                            {e.ingredient.id}
                          </TableCell>
                          <TableCell className="align-middle">
                            <Select
                              value={e.ingredient.id?.toString()} // value phải là string
                              onValueChange={(value) => {
                                const selectedId = parseInt(value);
                                const updated = [
                                  ...(editForm.recipeIngredients ?? []),
                                ];
                                const target = updated[index];

                                if (target) {
                                  target.ingredientId = selectedId;
                                  target.ingredient = ingredients.find(
                                    (ing) => ing.id === selectedId
                                  ) || {
                                    id: 0,
                                    name: "",
                                    unit: "",
                                  };
                                  setEditForm({
                                    ...editForm,
                                    recipeIngredients: updated,
                                  });
                                }
                              }}
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
                                    key={opt.value}
                                    value={opt.value.toString()}
                                  >
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="align-middle">
                            <Input
                              type="number"
                              style={{ fontSize: "0.95rem" }}
                              value={
                                editForm.recipeIngredients?.find(
                                  (ri) => ri.ingredientId === e.ingredient.id
                                )?.amountNeeded ?? ""
                              }
                              onChange={(event) => {
                                const newAmount = event.target.value;

                                setEditForm((prev) => ({
                                  ...prev,
                                  recipeIngredients: (
                                    prev.recipeIngredients ?? []
                                  ).map((ri) =>
                                    ri.ingredientId === e.ingredient.id
                                      ? { ...ri, amountNeeded: newAmount }
                                      : ri
                                  ),
                                }));
                              }}
                            />
                          </TableCell>
                          <TableCell className="align-middle">
                            {e.ingredient.unit}
                          </TableCell>
                          <TableCell className="align-middle">
                            <Button
                              variant="destructive"
                              style={{
                                padding: "5px 10px",
                                fontSize: "14px",
                              }}
                              onClick={() => {
                                const updated =
                                  editForm.recipeIngredients?.filter(
                                    (_, i) => i !== index
                                  ) ?? [];
                                setEditForm({
                                  ...editForm,
                                  recipeIngredients: updated,
                                });
                              }}
                            >
                              X
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-1 w-full min-w-0">
              <Label className="text-base">
                <strong>Mô tả:</strong>
              </Label>
              <Input
                placeholder="VD: g"
                value={editForm?.description ?? ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                style={{ fontSize: "0.95rem" }}
              />
            </div>
            <div className="flex flex-col gap-1 w-full min-w-0">
              <Label className="text-base">
                <strong>Ghi chú:</strong>
              </Label>
              <Textarea
                style={{ fontSize: "0.95rem" }}
                rows={3}
                placeholder="VD: 20"
                value={editForm?.note ?? ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    note: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full min-w-0">
              <Label className="text-base">
                <strong>Các bước thực hiện:</strong>
              </Label>
              <Input
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
              ></Input>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="secondary"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() =>
                selectedRecipe?.id &&
                handleUpdateRecipeByIdAPI(selectedRecipe?.id)
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
