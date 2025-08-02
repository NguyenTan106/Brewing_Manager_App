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
          <div className="grid gap-4 ">
            {/* Thời gian thực tế (editable nếu cần) */}
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label>Thời gian bắt đầu thực tế</Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  type="datetime-local"
                  // value={p.realStartedAt ?? ""}
                  // onChange={(e) => handleChangeStepTime(p.id, "realStartedAt", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label>Thời gian kết thúc thực tế</Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  type="datetime-local"
                  // value={p.realEndedAt ?? ""}
                  // onChange={(e) => handleChangeStepTime(p.id, "realEndedAt", e.target.value)}
                />
              </div>

              {/* Feedback */}
              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label>Nhận xét</Label>
                <Textarea
                  style={{ fontSize: "0.95rem" }}
                  placeholder="Viết gì đó về bước này..."
                  // value={p.feedback ?? ""}
                  // onChange={(e) => handleChangeStepFeedback(p.id, e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              className="bg-green-600 text-white hover:bg-green-700"
              // onClick={() =>
              //   selectedBatch?.id && handleUpdateBatchByIdAPI(selectedBatch?.id)
              // }
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
