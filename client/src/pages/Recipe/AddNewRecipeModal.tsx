import { useState } from "react";
import {
  createRecipeAPI,
  type RecipeStep,
} from "../../services/CRUD/CRUD_API_Recipe";
import type { Ingredient } from "../../services/CRUD/CRUD_API_Ingredient";
import { type RecipeIngredientInput } from "../../services/CRUD/CRUD_API_Recipe";
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
import mammoth from "mammoth";
import TurndownService from "turndown";
import { toast } from "sonner";
import { checkUser } from "@/components/Auth/Check";
import ReactMarkdown from "react-markdown";
import { minutesToOtherTimes } from "./MinutesToOtherTimes";
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
  const user = checkUser();
  const [form, setForm] = useState({
    name: "",
    description: "",
    note: "",
    instructions: "",
    recipeIngredients: [] as RecipeIngredientInput[],
    createdById: user?.id ?? 0,
    steps: [] as RecipeStep[],
  });

  const [currentStep, setCurrentStep] = useState<RecipeStep>({
    stepOrder: 1,
    durationMinutes: 0,
    name: "",
  });

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      note: "",
      instructions: "",
      recipeIngredients: [],
      createdById: user?.id ?? 0,
      steps: [],
    });
    setCurrentStep({ stepOrder: 1, durationMinutes: 0, name: "" });
  };

  const handleCreateRecipeAPI = async () => {
    if (
      form.name === "" ||
      form.recipeIngredients.length === 0 ||
      form.steps.length === 0
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const data = await createRecipeAPI(form);
    if (data.data == null) {
      toast.error(data.message);
      return;
    }
    if (data.data) {
      toast.success(data.message);
    }
    clearForm();
    handlePaginationAPI();
  };

  const options = ingredients.map((ing) => ({
    value: ing.id,
    label: ing.name,
  }));

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
      setForm((prev) => ({
        ...prev,
        instructions: markdown,
      }));
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      toast.error("Không thể đọc file Word. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <Dialog
        open={showAddModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[640px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                  placeholder="VD: India Pale Ale với hương vị hoa houblon mạnh"
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
              <div className="flex flex-col gap-1 w-full min-w-0 mt-2">
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
                      const durationMinutes = currentStep.durationMinutes;
                      const name = currentStep.name;
                      if (!name) {
                        return toast.warning("Yêu cầu nhập đầy đủ thông tin");
                      }
                      setForm({
                        ...form,
                        steps: [...form.steps, currentStep],
                      });
                      setCurrentStep({
                        stepOrder: currentStep.stepOrder + 1,
                        durationMinutes: 0,
                        name: "",
                      });
                    }}
                  >
                    <FaPlus /> Thêm bước
                  </Button>
                </div>
                {form.steps.map((p, idx) => (
                  <div key={idx}>
                    <div className="p-2 border rounded shadow-sm text-center">
                      <strong className="text-xl">Bước {p.stepOrder}</strong>:
                      <ReactMarkdown>{p.name}</ReactMarkdown>
                    </div>

                    {idx < form.steps.length - 1 && (
                      <div className="relative my-5 mt-4 h-6">
                        <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 text-4xl text-gray-500">
                          ↓
                        </div>
                        <div className="absolute left-1/2 top-1 transform -translate-x-2 ml-6 text-sm text-gray-600 italic">
                          {minutesToOtherTimes(p.durationMinutes)}
                        </div>
                      </div>
                    )}
                    {idx == form.steps.length - 1 && (
                      <div className="relative mt-4 h-6"></div>
                    )}
                  </div>
                ))}

                {/* <Input
                  type="file"
                  accept=".docx"
                  onChange={handleFileUpload}
                ></Input> */}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className=""
              variant="outline"
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
