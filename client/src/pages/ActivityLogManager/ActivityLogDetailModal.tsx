import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { ActivityLog } from "@/services/CRUD/CRUD_API_ActivityLog";
import ReactMarkdown from "react-markdown";

interface Props {
  showDetailModal: boolean;
  handleClose: () => void;
  selectedActivityLog: ActivityLog | null;
}

export default function ActivityLogDetailModal({
  showDetailModal,
  handleClose,
  selectedActivityLog,
}: Props) {
  return (
    <>
      <Dialog
        open={showDetailModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết nhật kí hoạt động.
            </DialogDescription>
          </DialogHeader>

          <Separator />
          <div className="test-base">
            <ReactMarkdown>{selectedActivityLog?.description}</ReactMarkdown>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
