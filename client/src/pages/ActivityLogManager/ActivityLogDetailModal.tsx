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
import type { ActivityLog } from "@/services/CRUD_API_ActivityLog";
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
            <DialogTitle>Hello</DialogTitle>
          </DialogHeader>
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
