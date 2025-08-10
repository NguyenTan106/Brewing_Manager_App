import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { toast } from "sonner";
import { getAllCompletedBatchesAPI } from "@/services/CRUD/CRUD_API_Batch";
import { getAllProductsAPI } from "@/services/CRUD/CRUD_API_Product";
import {
  BeerProductStatusMapToUI,
  BeerProductStatusDB,
  createNewBeerProductAPI,
} from "@/services/CRUD/CRUD_API_BeerProduct";
import { checkUser } from "@/components/Auth/Check";
interface Props {
  showAddNewBeerProductModal: boolean;
  handleClose: () => void;
  handleGetAllBeerProductsAPI: () => void;
}

export default function AddNewBeerProductModal({
  showAddNewBeerProductModal,
  handleClose,
  handleGetAllBeerProductsAPI,
}: Props) {
  const user = checkUser();
  const [form, setForm] = useState({
    batchId: 0,
    productId: 0,
    quantity: "",
    productionDate: "",
    expiryDate: "",
    status: "" as BeerProductStatusDB,
    createdById: user?.id ?? 0,
    notes: "",
  });
  const [completedBatches, setCompletedBatches] = useState<
    {
      id: number;
      beerName: string;
    }[]
  >([]);
  const [products, setProducts] = useState<
    {
      id: number;
      name: string;
      unitType: string;
    }[]
  >([]);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    unitType: string;
  } | null>(null);

  const [selectedCompletedBatchId, setSelectedCompletedBatchId] =
    useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const handleGetAllCompletedBatchesAPI = async () => {
    const data = await getAllCompletedBatchesAPI();
    setCompletedBatches(data);
  };
  const handleGetAllProductsAPI = async () => {
    const data = await getAllProductsAPI();
    setProducts(data.data);
  };

  const clearForm = () => {
    setSelectedCompletedBatchId("");
    setSelectedProductId("");
    setSelectedProduct(null);
    setForm({
      batchId: 0,
      productId: 0,
      quantity: "",
      productionDate: "",
      expiryDate: "",
      status: "" as BeerProductStatusDB,
      createdById: user?.id ?? 0,
      notes: "",
    });
  };

  const handleCreateBeerProductAPI = async () => {
    try {
      if (
        form.batchId === 0 ||
        form.productId === 0 ||
        form.quantity === "" ||
        form.productionDate === "" ||
        form.expiryDate === "" ||
        form.status === ("" as BeerProductStatusDB)
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin.");
        return;
      }
      const data = await createNewBeerProductAPI(form);
      if (data.data == null) {
        toast.error(data.message);
        return;
      }
      if (data.data) {
        toast.success(data.message, {
          description: new Date().toLocaleTimeString(),
        });
      }
      clearForm();
      handleGetAllBeerProductsAPI();
      handleClose();
    } catch (error) {
      console.error("Error creating beer product:", error);
      toast.error("Không thể thêm lô thành phẩm mới");
    }
  };

  useEffect(() => {
    handleGetAllCompletedBatchesAPI();
    handleGetAllProductsAPI();
  }, []);

  return (
    <>
      <Dialog
        open={showAddNewBeerProductModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[440px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Thêm lô thành phẩm mới
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Nhập thông tin chi tiết về lô thành phẩm mới.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 w-full  min-w-0">
                <Label className="text-base">
                  <strong>Mẻ đã hoàn thành:</strong>
                </Label>
                <Select
                  value={selectedCompletedBatchId}
                  onValueChange={(value) => {
                    setSelectedCompletedBatchId(value);
                    const selected = completedBatches.find(
                      (t) => t.id.toString() === value
                    );
                    setForm((prev) => ({
                      ...prev,
                      batchId: selected?.id ?? 0,
                    }));
                  }}
                >
                  <SelectTrigger
                    className="w-full"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <SelectValue placeholder="Chọn loại mẻ đã hoàn thành" />
                  </SelectTrigger>
                  <SelectContent>
                    {completedBatches.map((t) => (
                      <SelectItem
                        style={{ fontSize: "0.95rem" }}
                        key={t.id}
                        value={t.id.toString()}
                      >
                        {t.beerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
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
                    setForm((prev) => ({
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
                  <strong>Trạng thái: </strong>
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => {
                    setForm((prev) => ({
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
                  style={{ fontSize: "0.95rem" }}
                  type="number"
                  value={form?.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  placeholder="VD: 50"
                />
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
                  <strong>Ngày sản xuất:</strong>
                </Label>
                <Input
                  className="grid"
                  style={{ fontSize: "0.95rem" }}
                  required
                  type="datetime-local"
                  value={form.productionDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      productionDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Ngày hết hạn:</strong>
                </Label>
                <Input
                  className="grid"
                  style={{ fontSize: "0.95rem" }}
                  required
                  type="datetime-local"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expiryDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label className="text-base">
                  <strong>Ghi chú:</strong>
                </Label>
                <Textarea
                  style={{ fontSize: "0.95rem" }}
                  rows={4}
                  value={form?.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="VD: Malt nền cho nhiều loại bia, màu sáng, vị ngũ cốc nhẹ"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className=""
              variant="outline"
              onClick={() => handleCreateBeerProductAPI()}
            >
              <span className="d-none d-sm-inline">Thêm</span>
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
