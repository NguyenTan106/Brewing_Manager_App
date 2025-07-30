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
  Status,
  type Recipe,
} from "../../services/CRUD/CRUD_API_Batch";
import { getAllRecipesAPI } from "../../services/CRUD/CRUD_API_Recipe";
interface Props {
  showAddModal: boolean;
  handleClose: () => void;
  statusOptions: { label: string; value: Status }[];
  handlePaginationAPI: () => void;
}
export default function AddNewBatchModal({
  showAddModal,
  handleClose,
  statusOptions,
  handlePaginationAPI,
}: Props) {
  const user = checkUser();

  const [form, setForm] = useState({
    beerName: "",
    status: "" as Status,
    volume: "",
    notes: "",
    recipeId: "",
    createdById: user?.id ?? 0,
    recipe: null,
    batchIngredients: [],
  });
  const [recipeFromBatch, setRecipeFromBatch] = useState<Recipe[]>([]);
  const clearForm = () => {
    setForm({
      beerName: "",
      status: "" as Status,
      volume: "",
      notes: "",
      recipeId: "",
      createdById: user?.id ?? 0,
      recipe: null,
      batchIngredients: [],
    });
  };

  const handleCreateBatchAPI = async () => {
    if (
      form.beerName === "" ||
      form.status === ("" as Status) ||
      form.volume === "" ||
      form.recipeId === ""
    ) {
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
                  <strong>Trạng thái: </strong>
                </Label>
                <Select
                  value={form.status ?? ""}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value as Status })
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
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
                  placeholder="VD: g, kg"
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
            <div className="hidden">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Người tạo:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  disabled
                  required
                  value={form.createdById}
                  placeholder="VD: "
                />
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
