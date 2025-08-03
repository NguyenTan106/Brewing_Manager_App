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
import type {
  Batch,
  BatchStepFeedBack,
  BatchSteps,
} from "@/services/CRUD/CRUD_API_Batch";
import { useEffect, useState } from "react";
import { updateFeedBackBatchStep } from "../../services/CRUD/CRUD_API_Batch";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Props {
  showUpdateFeedbackBatchStepModal: boolean;
  handleClose: () => void;
  selectedBatch: Batch | null;
  selectedBatchStep: BatchSteps | null;
  setSelectedBatch: React.Dispatch<React.SetStateAction<Batch | null>>;
}

export default function UpdateFeedbackBatchStepModal({
  showUpdateFeedbackBatchStepModal,
  handleClose,
  selectedBatch,
  selectedBatchStep,
}: // setSelectedBatch,
Props) {
  const [editForm, setEditForm] = useState<Partial<BatchStepFeedBack>>();
  const handleUpdateFeedBackBatchSteps = async (
    id: number,
    editForm: BatchStepFeedBack
  ) => {
    try {
      if (
        editForm.actualDuration === selectedBatchStep?.actualDuration &&
        editForm.feedback === selectedBatchStep?.feedback
      ) {
        toast.warning("Không có gì cập nhật");
        return;
      }
      if (editForm.actualDuration === "" || editForm.feedback === "") {
        toast.warning("Vui lòng điền đầy đủ thông tin");
        return;
      }
      const batchStepInfo = await updateFeedBackBatchStep(id, editForm);
      if (batchStepInfo) toast.success("Cập nhật thành công");
      handleClose();
    } catch (err) {
      console.error("Lỗi khi cập nhật feedback:", err);
      toast.error("Lỗi khi cập nhật feedback");
    }
  };

  useEffect(() => {
    if (selectedBatchStep) {
      setEditForm(selectedBatchStep);
    }
  }, [selectedBatchStep]);
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
          <div className="grid gap-4 pt-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="">
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-lg font-medium">{selectedBatchStep?.id}</p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Bước</p>
                <p className="text-lg font-medium">
                  {selectedBatchStep?.stepOrder}
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 ">
            {/* Thời gian thực tế (editable nếu cần) */}
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label>Thời gian hoàn thành thực tế (phút)</Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  value={editForm?.actualDuration}
                  onChange={(e) =>
                    setEditForm({ ...editForm, actualDuration: e.target.value })
                  }
                  placeholder="VD: 1, 2, 30,..."
                />
                <div className="text-sm mt-1 text-gray-500">
                  <span>Ghi chú:</span>{" "}
                  <ReactMarkdown
                    components={{
                      ul: ({ node, ...props }) => (
                        <ul
                          style={{
                            listStyleType: "disc",
                            paddingLeft: "1.5rem",
                          }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {
                      "- 1 giờ: 60 phút \n- 1 ngày: 1440 phút \n- 1 tháng (30 ngày): 43200 phút"
                    }
                  </ReactMarkdown>
                </div>
              </div>

              {/* Feedback */}
              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label>Nhận xét</Label>
                <Textarea
                  style={{ fontSize: "0.95rem" }}
                  placeholder="Viết gì đó về nhận xét..."
                  value={editForm?.feedback}
                  onChange={(e) =>
                    setEditForm({ ...editForm, feedback: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => {
                handleUpdateFeedBackBatchSteps(
                  selectedBatchStep?.id ?? 0,
                  editForm ?? {}
                );
              }}
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
