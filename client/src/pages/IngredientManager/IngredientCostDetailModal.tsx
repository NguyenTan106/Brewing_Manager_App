import {
  Dialog,
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Ingredient } from "@/services/CRUD/CRUD_API_Ingredient";
import { useEffect, useState } from "react";
import { createIngredientCostAPI } from "@/services/CRUD/CRUD_API_Ingredient";
interface Props {
  showIngredientCostModal: boolean;
  handleClose: () => void;
  selectedIngredient: Ingredient | null;
  handlePaginationAPI: () => void;
}

export default function AddNewIngredientCost({
  showIngredientCostModal,
  handleClose,
  selectedIngredient,
}: Props) {
  return (
    <>
      <Dialog
        open={showIngredientCostModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[640px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết giá nhập qua thời gian
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Giá nhập được tính dựa trên VNĐ/1(g/kg)
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="grid gap-4">
            <Label className="mt-3 text-lg font-bold">
              Danh sách tất cả giá nhập của nguyên liệu{" "}
              <u>{selectedIngredient?.name}</u>:
            </Label>
            <Table className="text-base">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Giá nhập (VNĐ/1)</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Ngày nhập</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedIngredient?.allCost &&
                  selectedIngredient?.allCost.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.cost}</TableCell>
                      <TableCell className="whitespace-normal break-words">
                        {t.note}
                      </TableCell>
                      <TableCell>
                        {new Date(t.createdAt).toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                          hour12: false,
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <DialogClose className="flex gap-3" asChild>
              <div>
                <Button variant="secondary" onClick={handleClose}>
                  Đóng
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
