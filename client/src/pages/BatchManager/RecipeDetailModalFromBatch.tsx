import { Modal } from "react-bootstrap";
import type { Batch } from "../../services/CRUD_API_Batch";
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
import { Badge } from "@/components/ui/badge";

interface Props {
  handleClose: () => void;
  showDetailRecipeModal: boolean;
  selectedBatch: Batch | null;
  usedIngredients: [];
}

export default function RecipeDetailModalFromBatch({
  handleClose,
  showDetailRecipeModal,
  selectedBatch,
  usedIngredients,
}: Props) {
  return (
    <>
      <Dialog
        open={showDetailRecipeModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết công thức
            </DialogTitle>
          </DialogHeader>

          <Separator />

          <div className="grid gap-4 pt-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">
                  {selectedBatch?.recipe && selectedBatch?.recipe.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tên nguyên liệu</p>
                <p className="text-base ">
                  {selectedBatch?.recipe && selectedBatch?.recipe.name}
                </p>
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p className="text-base whitespace-pre-line">
                  {selectedBatch?.recipe && selectedBatch?.recipe.description}
                </p>
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Nguyên liệu cần</p>
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Số lượng cần</TableHead>
                      <TableHead>Loại</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBatch?.recipe &&
                    selectedBatch?.recipe.recipeIngredients.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted"
                        >
                          <p>Không có nguyên liệu</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedBatch?.recipe &&
                      selectedBatch?.recipe.recipeIngredients.map(
                        (e, index) => (
                          <TableRow
                            className="align-middle"
                            key={e.ingredient.id}
                          >
                            <TableCell>{e.ingredient.id}</TableCell>
                            <TableCell>{e.ingredient.name}</TableCell>
                            <TableCell>
                              {usedIngredients?.[index] ?? "-"}
                              {e.ingredient.unit} / {selectedBatch.volume}L
                            </TableCell>

                            <td>{e.ingredient.type}</td>
                          </TableRow>
                        )
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Các bước thực hiện
                </p>
                <p className="text-base font-medium">
                  {selectedBatch?.recipe && selectedBatch?.recipe.instructions}
                </p>
              </div>

              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Ghi chú</p>
                <p className="text-base whitespace-pre-line">
                  {selectedBatch?.recipe && selectedBatch?.recipe.note}
                </p>
              </div>

              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="text-base">
                  {selectedBatch?.recipe &&
                    selectedBatch?.recipe.createdAt &&
                    new Date(selectedBatch?.recipe.createdAt).toLocaleString(
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
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
