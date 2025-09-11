import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import {
  createNewProductAPI,
  type Product,
} from "@/services/CRUD/CRUD_API_Product";

interface Props {
  showAddNewProductModal: boolean;
  handleClose: () => void;
  selectedProduct: Product | null;
  handleGetAllProductsAPI: () => Promise<void>;
}

export default function AddNewProductModal({
  showAddNewProductModal,
  handleClose,
  selectedProduct,
  handleGetAllProductsAPI,
}: Props) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    volume: "",
    unitType: "",
  });

  const clearForm = () => {
    setForm({
      code: "",
      name: "",
      description: "",
      volume: "",
      unitType: "",
    });
  };
  const handleCreateNewProductAPI = async () => {
    try {
      if (
        form.code === "" ||
        form.name === "" ||
        form.description === "" ||
        form.volume === "" ||
        form.unitType === ""
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin.");
        return;
      }
      const data = await createNewProductAPI(form);
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
      handleGetAllProductsAPI();
      handleClose();
    } catch (error) {
      console.error("Error creating beer product:", error);
      toast.error("Không thể thêm lô thành phẩm mới");
    }
  };
  return (
    <>
      <Dialog
        open={showAddNewProductModal}
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
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Mã loại bia:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value,
                    })
                  }
                  placeholder="VD: STOUT-500, PALEALE-330"
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Tên loại bia: </strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="VD: Bia Stout 500ml"
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Đơn vị:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.unitType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      unitType: e.target.value,
                    })
                  }
                  placeholder="VD: chai, thùng, két,..."
                />
              </div>

              <div className="flex flex-col gap-1 w-full md:w-[48%] min-w-0">
                <Label className="text-base">
                  <strong>Thể tích (ml/lít) mỗi đơn vị:</strong>
                </Label>
                <Input
                  style={{ fontSize: "0.95rem" }}
                  required
                  value={form.volume}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      volume: e.target.value,
                    })
                  }
                  placeholder="VD: 330, 500,..."
                />
              </div>

              <div className="flex flex-col gap-1 w-full min-w-0">
                <Label className="text-base">
                  <strong>Mô tả:</strong>
                </Label>
                <Textarea
                  style={{ fontSize: "0.95rem" }}
                  rows={4}
                  value={form?.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="VD: Malt nền cho nhiều loại bia, màu sáng, vị ngũ cốc nhẹ"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className=""
              variant="outline"
              onClick={() => handleCreateNewProductAPI()}
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
