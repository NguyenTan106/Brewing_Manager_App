import { useState, useEffect } from "react";
import type {
  RecipeStep,
  RecipeUpate,
} from "../../services/CRUD/CRUD_API_Recipe";
import { updateRecipeByIdAPI } from "../../services/CRUD/CRUD_API_Recipe";
import { type RecipeIngredient } from "../../services/CRUD/CRUD_API_Recipe";
import type { Ingredient } from "../../services/CRUD/CRUD_API_Ingredient";
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
import { FaPlus, FaTrash } from "react-icons/fa";
import mammoth from "mammoth";
import TurndownService from "turndown";
import { toast } from "sonner";
import { minutesToOtherTimes } from "./MinutesToOtherTimes";
import ReactMarkdown from "react-markdown";

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
  const [currentStep, setCurrentStep] = useState<RecipeStep>({
    stepOrder: 1,
    durationMinutes: 0,
    name: "",
  });

  useEffect(() => {
    if (selectedRecipe) {
      setEditForm(selectedRecipe);
    }
  }, [selectedRecipe]);

  useEffect(() => {
    if (showUpdateModal && selectedRecipe && selectedRecipeIngredient) {
      const steps = selectedRecipe.steps ?? [];

      const nextStepOrder =
        steps.length > 0 ? Math.max(...steps.map((s) => s.stepOrder)) + 1 : 1;

      setCurrentStep({
        stepOrder: nextStepOrder,
        durationMinutes: 0,
        name: "",
      });

      // Cập nhật editForm nếu cần
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
        steps: steps,
      });
    }
  }, [showUpdateModal, selectedRecipe, selectedRecipeIngredient]);

  const handleRemoveStep = (index: number) => {
    const updatedSteps = [...(editForm.steps ?? [])];
    updatedSteps.splice(index, 1);

    // Optionally re-index lại stepOrder cho đẹp
    const reindexedSteps = updatedSteps.map((s, i) => ({
      ...s,
      stepOrder: i + 1,
    }));

    setEditForm({
      ...editForm,
      steps: reindexedSteps,
    });

    // Cập nhật lại stepOrder cho bước tiếp theo
    setCurrentStep({
      stepOrder: reindexedSteps.length + 1,
      durationMinutes: 0,
      name: "",
    });
  };

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
        editForm.steps?.length === 0
      ) {
        toast.warning("Vui lòng điền đầy đủ thông tin");
        return;
      }

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
          ) &&
        JSON.stringify(editForm.steps?.map((i) => i.name)) ===
          JSON.stringify(selectedRecipe?.steps.map((i) => i.name)) &&
        JSON.stringify(editForm.steps?.map((i) => i.durationMinutes)) ===
          JSON.stringify(selectedRecipe?.steps.map((i) => i.durationMinutes))
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
            {/* <div className="flex flex-col gap-1 w-full min-w-0">
              <Label className="text-base">
                <strong>Các bước thực hiện:</strong>
              </Label>
              <Input
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
              ></Input>
            </div> */}
            <div className="flex justify-between items-center flex-wrap">
              <Label className="text-lg font-bold">
                <>Các bước thực hiện: </>
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-base">
                  <>Bước:</>
                </Label>
                <Input
                  type="number"
                  placeholder="Step"
                  value={currentStep.stepOrder}
                  onChange={(e) =>
                    setCurrentStep({
                      ...currentStep,
                      stepOrder: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-base">
                  <>Thời gian hoàn thành (phút):</>
                </Label>
                <Input
                  type="number"
                  placeholder="Thời gian (phút)"
                  value={currentStep.durationMinutes}
                  onChange={(e) =>
                    setCurrentStep({
                      ...currentStep,
                      durationMinutes: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="col-span-full">
                <Label className="text-base">
                  <>Mô tả:</>
                </Label>
                <Textarea
                  placeholder="Mô tả"
                  value={currentStep.name}
                  onChange={(e) =>
                    setCurrentStep({
                      ...currentStep,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-between items-center flex-wrap my-2">
              <Label className="text-lg font-bold">
                <>Danh sách bước:</>
              </Label>
              <Button
                style={{ fontSize: "0.95rem" }}
                className="col-span-full"
                onClick={() => {
                  const name = currentStep.name;
                  if (!name) {
                    return toast.warning("Yêu cầu nhập đầy đủ thông tin");
                  }
                  setEditForm({
                    ...editForm,
                    steps: [...(editForm.steps ?? []), currentStep],
                  });
                  setCurrentStep({
                    stepOrder: (editForm.steps?.length ?? 0) + 1,
                    durationMinutes: 0,
                    name: "",
                  });
                }}
              >
                <FaPlus /> Thêm bước
              </Button>
              <Button
                variant="outline"
                style={{ fontSize: "0.95rem" }}
                className="col-span-full"
                onClick={() => {
                  if (!editForm.steps || editForm.steps.length === 0) {
                    return toast.info("Không còn bước nào để xóa");
                  }

                  const updatedSteps = [...editForm.steps];
                  // Tìm step có stepOrder lớn nhất
                  const maxStepOrder = Math.max(
                    ...updatedSteps.map((s) => s.stepOrder)
                  );
                  const filtered = updatedSteps.filter(
                    (s) => s.stepOrder !== maxStepOrder
                  );

                  setEditForm({
                    ...editForm,
                    steps: filtered,
                  });

                  setCurrentStep({
                    stepOrder: maxStepOrder, // quay lại đúng stepOrder vừa bị xóa
                    durationMinutes: 0,
                    name: "",
                  });
                }}
              >
                <FaTrash className="mr-1" /> Xóa bước cuối
              </Button>
            </div>
            {editForm.steps &&
              editForm.steps.map((p, idx) => (
                <div key={idx}>
                  <div className="p-2 border rounded shadow-sm text-center">
                    <strong className="text-xl">Bước {p.stepOrder}</strong>:
                    <ReactMarkdown>{p.name}</ReactMarkdown>
                  </div>

                  {editForm.steps && idx < editForm.steps.length - 1 && (
                    <div className="relative my-5 mt-4 h-6">
                      <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 text-4xl text-gray-500">
                        ↓
                      </div>
                      <div className="absolute left-1/2 top-1 transform -translate-x-2 ml-6 text-sm text-gray-600 italic">
                        {minutesToOtherTimes(p.durationMinutes)}
                      </div>
                    </div>
                  )}
                  {editForm.steps && idx == editForm.steps.length - 1 && (
                    <div className="relative mt-4 h-6"></div>
                  )}
                </div>
              ))}
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
