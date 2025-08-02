import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Batch, BatchSteps } from "@/services/CRUD/CRUD_API_Batch";
import { useState } from "react";
import { updateFeedBackBatchSteps } from "../../services/CRUD/CRUD_API_Batch";
import ReactMarkdown from "react-markdown";
import { minutesToOtherTimes } from "../Recipe/MinutesToOtherTimes";

interface Props {
  showUpdateFeedbackBatchStepModal: boolean;
  handleClose: () => void;
  selectedBatch: Batch | null;
}

export default function UpdateFeedbackBatchStepModal({
  showUpdateFeedbackBatchStepModal,
  handleClose,
  selectedBatch,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<BatchSteps>>();
  const handleUpdateFeedBackBatchSteps = async (
    id: number,
    editForm: BatchSteps
  ) => {
    const batchStepInfo = await updateFeedBackBatchSteps(id, editForm);
  };
  return (
    <>
      <Dialog
        open={showUpdateFeedbackBatchStepModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Nhận xét {selectedBatch?.beerName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <p>
              <strong>ID:</strong> {selectedBatch?.id}
            </p>

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
                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
                          <Label className="text-base">
                            <strong>Thời gian hoàn thành thực tế:</strong>
                          </Label>
                          <Input
                            style={{ fontSize: "0.95rem" }}
                            type="datetime-local"
                            className="grid"
                            value={
                              editForm?.actualDuration
                                ? editForm.actualDuration
                                : ""
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                actualDuration: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-base">
                          <strong>Ghi chú:</strong>
                        </Label>
                        <Textarea
                          style={{ fontSize: "0.95rem" }}
                          rows={4}
                          placeholder="VD: 20"
                          value={editForm?.feedback ?? ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              feedback: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() =>
                selectedBatch?.id && handleUpdateBatchByIdAPI(selectedBatch?.id)
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
