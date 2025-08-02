import {
  getBatchByIdAPI,
  type Batch,
} from "../../services/CRUD/CRUD_API_Batch";
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
import { Card } from "@/components/ui/card";
import { useState } from "react";
import UpdateFeedbackBatchStepModal from "./UpdateFeedbackBatchStepModal";

interface Props {
  handleClose: () => void;
  showDetailRecipeModal: boolean;
  selectedBatch: Batch | null;
  setSelectedBatch: React.Dispatch<React.SetStateAction<Batch | null>>;
}

export default function RecipeDetailModalFromBatch({
  handleClose,
  showDetailRecipeModal,
  selectedBatch,
  setSelectedBatch,
}: Props) {
  const [
    showUpdateFeedbackBatchStepModal,
    setShowUpdateFeedbackBatchStepModal,
  ] = useState(false);
  const handleOpenFeedbackModal = async (id: number) => {
    const batch = await getBatchByIdAPI(id);
    setSelectedBatch(batch);
    setShowUpdateFeedbackBatchStepModal(true);
  };
  return (
    <>
      <UpdateFeedbackBatchStepModal
        showUpdateFeedbackBatchStepModal={showUpdateFeedbackBatchStepModal}
        handleClose={() => setShowUpdateFeedbackBatchStepModal(false)}
        selectedBatch={selectedBatch}
      />

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
                <div className="text-base ">
                  {selectedBatch?.batchSteps &&
                    selectedBatch?.batchSteps.map((p, idx) => (
                      <div key={idx}>
                        <Card className="p-4 my-2 shadow-sm gap-4">
                          <div className="flex items-center justify-between ">
                            <h3 className="text-xl font-semibold">
                              Bước {p.stepOrder}
                            </h3>
                            <span className="text-lg text-green-700 italic">
                              Thời gian dự kiến:{" "}
                              {minutesToOtherTimes(
                                (Number(new Date(p.scheduledEndAt)) -
                                  Number(new Date(p.startedAt))) /
                                  1000 /
                                  60
                              )}
                            </span>
                          </div>
                          {(Number(new Date(p.scheduledEndAt)) -
                            Number(new Date(p.startedAt))) /
                            1000 /
                            60 !=
                            0 &&
                            selectedBatch?.batchSteps &&
                            idx < selectedBatch?.batchSteps.length && (
                              <div className="grid gap-4 ">
                                {/* Thời gian thực tế (editable nếu cần) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="col-span-full">
                                    <p className="text-sm text-muted-foreground">
                                      Hành động chi tiết:
                                    </p>
                                    <p className="text-base font-medium">
                                      <ReactMarkdown>{p.name}</ReactMarkdown>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Thời gian bắt đầu thực tế
                                    </p>
                                    <p className="text-base font-medium">
                                      {selectedBatch?.id}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Thời gian kết thúc thực tế
                                    </p>
                                    <p className="text-base font-medium">
                                      {selectedBatch?.id}
                                    </p>
                                  </div>
                                  <div className="col-span-full">
                                    <p className="text-sm text-muted-foreground">
                                      Nhận xét
                                    </p>
                                    <p className="text-base font-medium">
                                      {selectedBatch?.id}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-1 w-full min-w-0">
                                  <Button
                                    title="Xem chi tiết nguyên liệu"
                                    variant="outline"
                                    onClick={() =>
                                      handleOpenFeedbackModal(Number(p.id))
                                    }
                                    style={{
                                      padding: "5px 10px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    📋{" "}
                                    <span className="hidden sm:inline">
                                      Nhận xét
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            )}
                        </Card>
                        {(Number(new Date(p.scheduledEndAt)) -
                          Number(new Date(p.startedAt))) /
                          1000 /
                          60 !=
                          0 &&
                          selectedBatch?.batchSteps &&
                          idx < selectedBatch?.batchSteps.length && (
                            <div className="text-4xl text-gray-500 text-center">
                              {" "}
                              ↓
                            </div>
                          )}
                      </div>
                    ))}
                </div>
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
