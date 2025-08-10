import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BeerProductStatusMapToUI,
  updateBeerProductByIdAPI,
  type BeerProduct,
  type BeerProductStatusDB,
} from "@/services/CRUD/CRUD_API_BeerProduct";
import { useEffect, useState } from "react";
import { getAllProductsAPI } from "@/services/CRUD/CRUD_API_Product";
import { toast } from "sonner";

interface Props {
  showUpdateModal: boolean;
  handleClose: () => void;
  selectedBeerProduct: BeerProduct | null;
  handleGetAllBeerProductsAPI: () => void;
}
export default function UpdateBeerProductModal({
  showUpdateModal,
  handleClose,
  selectedBeerProduct,
  handleGetAllBeerProductsAPI,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<BeerProduct>>({});
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    unitType: string;
  } | null>(null);
  const [products, setProducts] = useState<
    {
      id: number;
      name: string;
      unitType: string;
    }[]
  >([]);

  const handleGetAllProductsAPI = async () => {
    const data = await getAllProductsAPI();
    setProducts(data.data);
  };
  useEffect(() => {
    handleGetAllProductsAPI();
    if (selectedBeerProduct) {
      setSelectedProductId(selectedBeerProduct.productId.toString());
      setSelectedProduct({
        id: selectedBeerProduct.productId,
        name: selectedBeerProduct.product?.name || "",
        unitType: selectedBeerProduct.product?.unitType || "",
      });
      setEditForm(selectedBeerProduct);
    }
  }, [selectedBeerProduct]);

  const handleUpdateBeerProductByIdAPI = async (id: number) => {
    if (!id) return;
    try {
      if (
        editForm.batchId === 0 ||
        editForm.productId === 0 ||
        editForm.quantity === "" ||
        editForm.productionDate === "" ||
        editForm.expiryDate === "" ||
        editForm.status === ("" as BeerProductStatusDB)
      ) {
        toast.warning("Vui lòng điền đầy đủ thông tin");
        return;
      }
      // Kiểm tra xem có thay đổi nào không
      if (
        selectedBeerProduct?.batchId == editForm.batchId &&
        selectedBeerProduct?.productId == editForm.productId &&
        selectedBeerProduct?.quantity == editForm.quantity &&
        selectedBeerProduct?.productionDate == editForm.productionDate &&
        selectedBeerProduct?.expiryDate == editForm.expiryDate &&
        selectedBeerProduct?.notes == editForm.notes
      ) {
        toast.warning("Không có thay đổi nào để cập nhật");
        return;
      }
      await updateBeerProductByIdAPI(id, editForm);

      handleClose();
      handleGetAllBeerProductsAPI();
      toast.success("Cập nhật lô sản phẩm bia thành công", {
        description: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật lô thành phẩm:", err);
      toast.error("Lỗi khi cập nhật lô thành phẩm");
    }
  };

  const toDatetimeLocalValue = (date: string) => {
    const dateFormat = new Date(date); // ISO string từ DB
    const offset = dateFormat.getTimezoneOffset();
    const localDate = new Date(dateFormat.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const fromDatetimeLocalValue = (value: string) => {
    if (!value || isNaN(Date.parse(value))) {
      console.warn("Giá trị ngày giờ không hợp lệ:", value);
      return null;
    }
    const date = new Date(value);
    return date.toISOString();
  };

  return (
    <>
      <Dialog
        open={showUpdateModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <form>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Cập nhật lô thanh phẩm
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin lô thành phẩm: {selectedBeerProduct?.code}
              </DialogDescription>
            </DialogHeader>

            <Separator />

            <div className="grid gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0 ">
                  <Label className="text-base">
                    <strong>ID:</strong> {selectedBeerProduct?.id}
                  </Label>
                </div>
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0 ">
                  <Label className="text-base">
                    <strong>Mã lô:</strong> <u>{selectedBeerProduct?.code}</u>
                  </Label>
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0 ">
                  <Label className="text-base">
                    <strong>Loại bia: </strong>
                  </Label>
                  <Select
                    value={selectedProductId}
                    onValueChange={(value) => {
                      setSelectedProductId(value);
                      const selected = products.find(
                        (t) => t.id.toString() === value
                      );
                      if (selected) setSelectedProduct(selected);
                      setEditForm((prev) => ({
                        ...prev,
                        productId: selected?.id ?? 0,
                      }));
                    }}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{ fontSize: "0.95rem" }}
                    >
                      <SelectValue placeholder="Chọn loại bia" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((t) => (
                        <SelectItem
                          style={{ fontSize: "0.95rem" }}
                          key={t.id}
                          value={t.id.toString()}
                        >
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Đơn vị:</strong>
                  </Label>
                  <Input
                    value={selectedProduct?.unitType ?? ""}
                    style={{
                      fontSize: "0.95rem",
                      backgroundColor: "gray",
                      fontWeight: "bold",
                    }}
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Trạng thái:</strong>
                  </Label>
                  <Select
                    value={editForm.status ?? ""}
                    onValueChange={(value) => {
                      setEditForm((prev) => ({
                        ...prev,
                        status: value as BeerProductStatusDB,
                      }));
                    }}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{ fontSize: "0.95rem" }}
                    >
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BeerProductStatusMapToUI).map(
                        ([dbValue, uiLabel]) => (
                          <SelectItem
                            key={dbValue}
                            value={dbValue} // giá trị DB
                            style={{ fontSize: "0.95rem" }}
                          >
                            {uiLabel} {/* hiển thị tiếng Việt */}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Số lượng:</strong>
                  </Label>
                  <Input
                    style={{
                      fontSize: "0.95rem",
                    }}
                    type="number"
                    placeholder="VD: 20"
                    value={editForm?.quantity ?? ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Ngày sản xuất:</strong>
                  </Label>
                  <Input
                    style={{ fontSize: "0.95rem" }}
                    type="datetime-local"
                    value={
                      editForm.productionDate
                        ? toDatetimeLocalValue(editForm.productionDate)
                        : ""
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        productionDate:
                          fromDatetimeLocalValue(e.target.value) || "",
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                  <Label className="text-base">
                    <strong>Ngày hết hạn:</strong>
                  </Label>
                  <Input
                    type="datetime-local"
                    style={{ fontSize: "0.95rem" }}
                    value={
                      editForm.expiryDate
                        ? toDatetimeLocalValue(editForm.expiryDate)
                        : ""
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        expiryDate:
                          fromDatetimeLocalValue(e.target.value) || "",
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 w-full md:w-[100%] min-w-0">
                  <Label className="text-base font-bold">Ghi chú:</Label>
                  <Textarea
                    style={{ fontSize: "0.95rem" }}
                    placeholder="Nhập ghi chú..."
                    value={editForm?.notes ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={4} // có thể chỉnh số dòng
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="secondary"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => {
                  if (selectedBeerProduct?.id)
                    handleUpdateBeerProductByIdAPI(selectedBeerProduct?.id);
                }}
                style={{
                  padding: "5px 10px",
                }}
              >
                ✏️ <span className="d-none d-sm-inline">Cập nhật</span>
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Huỷ</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
