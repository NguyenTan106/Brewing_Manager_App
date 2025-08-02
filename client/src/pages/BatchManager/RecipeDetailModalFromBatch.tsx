import type { Batch } from "../../services/CRUD/CRUD_API_Batch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import ReactMarkdown from "react-markdown";
import { minutesToOtherTimes } from "../Recipe/MinutesToOtherTimes";

interface Props {
  handleClose: () => void;
  showDetailRecipeModal: boolean;
  selectedBatch: Batch | null;
}

export default function RecipeDetailModalFromBatch({
  handleClose,
  showDetailRecipeModal,
  selectedBatch,
}: Props) {
  return (
    <>
      <Dialog
        open={showDetailRecipeModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[440px] md:max-w-[600px]   max-h-[90vh] overflow-y-auto">
          {" "}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết công thức
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết về công thức đang được sử dụng.
            </DialogDescription>
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
                <p className="text-base font-medium">
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
                      selectedBatch?.batchIngredients &&
                      selectedBatch.batchIngredients.map((e) => (
                        <TableRow className="align-middle" key={e.id}>
                          <TableCell>{e.ingredient.id}</TableCell>
                          <TableCell>{e.ingredient.name}</TableCell>
                          <TableCell>
                            {e.amountUsed != null
                              ? `${Number(e.amountUsed).toFixed(2)} ${
                                  e.ingredient.unit
                                } / ${selectedBatch.volume}L`
                              : "-"}
                          </TableCell>
                          <TableCell>{e.ingredient.type}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">
                  Các bước thực hiện
                </p>
                <p className="text-base ">
                  {selectedBatch?.batchSteps &&
                    selectedBatch?.batchSteps.map((p, idx) => (
                      <div key={idx}>
                        {/* Hiển thị bước */}
                        <div className="p-2 border rounded shadow-sm text-center">
                          <strong className="text-xl">
                            Bước {p.stepOrder}:{" "}
                          </strong>
                          <ReactMarkdown>{p.name}</ReactMarkdown>
                        </div>

                        {/* Hiển thị mũi tên + thời gian (nếu không phải bước cuối) */}
                        {(Number(new Date(p.scheduledEndAt)) -
                          Number(new Date(p.startedAt))) /
                          1000 /
                          60 !=
                          0 &&
                          selectedBatch?.batchSteps &&
                          idx < selectedBatch?.batchSteps.length && (
                            <div className="relative my-5 mt-4 h-6">
                              {/* Mũi tên ở giữa */}
                              <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 text-4xl text-gray-500">
                                ↓
                              </div>

                              {/* Thời gian nằm bên phải mũi tên */}
                              <div className="absolute left-1/2 top-1 transform -translate-x-2 ml-6 text-sm text-gray-600 italic">
                                {minutesToOtherTimes(
                                  (Number(new Date(p.scheduledEndAt)) -
                                    Number(new Date(p.startedAt))) /
                                    1000 /
                                    60
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
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
