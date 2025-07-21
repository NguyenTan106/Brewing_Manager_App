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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết nguyên liệu</DialogTitle>
          </DialogHeader>
          <div>
            <p>
              <strong>ID:</strong> {selectedIngredient?.id}
            </p>
            <p>
              <strong>Tên:</strong> {selectedIngredient?.name}
            </p>
            <p>
              <strong>Loại:</strong>
              {selectedIngredient?.type &&
                getIngredientIcon(selectedIngredient.type)}
              {selectedIngredient?.type}
            </p>
            <p>
              <strong>Số lượng:</strong> {selectedIngredient?.quantity}{" "}
              {selectedIngredient?.unit}
            </p>
            <p>
              <strong>Trạng thái: </strong>
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
            <p>
              <strong>Ghi chú: </strong>
              <i>{selectedIngredient?.notes}</i>
            </p>
            <p>
              <strong>Ngày nhập kho gần nhất: </strong>
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
