import { type Ingredient } from "../../services/CRUD_API_Ingredient";
import { getIngredientIcon } from "../IngredientManager/IngredientIcon";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  showDetailIngredientModal: boolean;
  handleClose: () => void;
  selectedIngredient: Ingredient;
}

export default function IngredientDetailModalFromRecipe({
  showDetailIngredientModal,
  handleClose,
  selectedIngredient,
}: Props) {
  return (
    <>
      <Dialog
        open={showDetailIngredientModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết nguyên liệu
            </DialogTitle>
          </DialogHeader>

          <Separator />

          <div className="grid gap-4 pt-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">
                  {selectedIngredient?.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tên nguyên liệu</p>
                <p className="text-base font-medium">
                  {selectedIngredient?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loại</p>
                <p className="text-base">
                  {selectedIngredient?.type &&
                    getIngredientIcon(selectedIngredient.type)}
                  {selectedIngredient?.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số lượng</p>
                <p className="text-base">
                  {Number(selectedIngredient?.quantity).toFixed(2)}{" "}
                  {selectedIngredient?.unit}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <p className="text-base">
                  {" "}
                  {selectedIngredient?.status === "Đủ" && (
                    <Badge
                      variant="outline"
                      className="me-1"
                      key={selectedIngredient?.id}
                    >
                      {selectedIngredient?.status}
                    </Badge>
                  )}
                  {selectedIngredient?.status === "Sắp hết" && (
                    <Badge
                      variant="outline"
                      className="me-1"
                      key={selectedIngredient?.id}
                    >
                      {selectedIngredient?.status}
                    </Badge>
                  )}
                  {selectedIngredient?.status === "Hết" && (
                    <Badge
                      variant="outline"
                      className="me-1"
                      key={selectedIngredient?.id}
                    >
                      {selectedIngredient?.status}
                    </Badge>
                  )}
                </p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">
                  Ngày nhập kho gần nhất
                </p>
                <p className="text-base">
                  {selectedIngredient?.lastImportDate &&
                    new Date(selectedIngredient.lastImportDate).toLocaleString(
                      "vi-VN",
                      {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour12: false,
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                </p>
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Ghi chú</p>
                <p className="text-base ">{selectedIngredient?.notes}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
