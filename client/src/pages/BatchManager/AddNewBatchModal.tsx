import { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { checkUser } from "@/components/Auth/Check";
import {
  createBatchAPI,
  type Recipe,
} from "../../services/CRUD/CRUD_API_Batch";
import { getAllRecipesAPI } from "../../services/CRUD/CRUD_API_Recipe";
import { sendAlertEmailAPI } from "@/services/send_mail_API";
import { minutesToOtherTimes } from "../Recipe/MinutesToOtherTimes";
import { marked } from "marked";
import renderNewBatchEmail from "@/components/SendMail/renderNewBatchEmail";
interface Props {
  showAddModal: boolean;
  handleClose: () => void;
  handlePaginationAPI: () => void;
}

interface BatchIngredient {
  ingredient: {
    name: string;
    unit: string;
    type: string;
  };
  amountUsed: number;
}

interface BatchStep {
  stepOrder: number;
  name: string;
  startedAt: string; // ISO string
  scheduledEndAt: string;
  notes?: string;
}

export default function AddNewBatchModal({
  showAddModal,
  handleClose,
  handlePaginationAPI,
}: Props) {
  const user = checkUser();

  const [form, setForm] = useState({
    beerName: "",
    volume: "",
    notes: "",
    recipeId: "",
    createdById: user?.id ?? 0,
    recipe: null,
    batchIngredients: [],
    batchSteps: [],
    status: "",
  });
  const [recipeFromBatch, setRecipeFromBatch] = useState<Recipe[]>([]);
  const clearForm = () => {
    setForm({
      beerName: "",
      volume: "",
      notes: "",
      recipeId: "",
      createdById: user?.id ?? 0,
      recipe: null,
      batchIngredients: [],
      batchSteps: [],
      status: "",
    });
  };

  const handleCreateBatchAPI = async () => {
    if (form.beerName === "" || form.volume === "" || form.recipeId === "") {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const data = await createBatchAPI(form);
    if (data.data == null || data.data.length == 0) {
      toast.warning(data.message);
      return;
    }
    if (data.data) {
      toast.success(data.message);
    }
    // console.log(data.data);

    const { subject, html, text } = renderNewBatchEmail(data);
    sendAlertEmailAPI(subject, text, html);
    handlePaginationAPI();
    clearForm();
  };

  useEffect(() => {
    handleGetAllRecipeAPI();
  }, []);

  const handleGetAllRecipeAPI = async () => {
    const recipe = await getAllRecipesAPI();
    setRecipeFromBatch(recipe);
  };
  const recipeOptions = recipeFromBatch.map((re) => ({
    value: re.id,
    label: re.name,
  }));
  return (
    <>
      <Dialog
        open={showAddModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Thêm nguyên mẻ
            </DialogTitle>
          </DialogHeader>
          <Separator />

          <div className="grid gap-4 ">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Tên mẻ:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.beerName}
                  onChange={(e) =>
                    setForm({ ...form, beerName: e.target.value })
                  }
                  placeholder="VD: "
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Khối lượng mẻ (Lít): </strong>
                </Label>
                <Input
                  required
                  style={{ fontSize: "0.95rem" }}
                  type="numer"
                  value={form.volume}
                  onChange={(e) => setForm({ ...form, volume: e.target.value })}
                  placeholder="VD: 50"
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Chọn công thức: </strong>
                </Label>
                <Select
                  value={form.recipeId}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, recipeId: value }))
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <SelectValue placeholder="Chọn công thức" />
                  </SelectTrigger>

                  <SelectContent>
                    {recipeOptions.map((option) => (
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

            <div className="flex flex-col gap-1 w-full min-w-0">
              <Label className="text-base">
                <strong>Ghi chú:</strong>
              </Label>
              <Textarea
                required
                style={{ fontSize: "0.95rem" }}
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="VD: "
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className=""
              variant="outline"
              onClick={() => handleCreateBatchAPI()}
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
