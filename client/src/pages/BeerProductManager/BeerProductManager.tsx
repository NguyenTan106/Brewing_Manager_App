import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";
import {
  type BeerProduct,
  getAllBeerProductsAPI,
  getBeerProductByIdAPI,
} from "@/services/CRUD/CRUD_API_BeerProduct";
import BeerProductDetailModal from "./BeerProductDetailModal";
export default function BeerProductManager() {
  const [beerProducts, setBeerProducts] = useState<BeerProduct[]>([]);
  const [showAddNewBeerProductModal, setShowAddNewBeerProductModal] =
    useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBeerProduct, setSelectedBeerProduct] =
    useState<BeerProduct | null>(null);
  useEffect(() => {
    handleGetAllBeerProductsAPI();
  }, []);
  useEffect(() => {
    if (selectedBeerProduct?.id != null) {
      const item = beerProducts.find((e) => e.id === selectedBeerProduct.id);
      if (
        item &&
        JSON.stringify(item) !== JSON.stringify(selectedBeerProduct)
      ) {
        setSelectedBeerProduct(item);
      }
    }
  }, [beerProducts]);

  const handleGetAllBeerProductsAPI = async () => {
    const data = await getAllBeerProductsAPI();
    setBeerProducts(data.data);
  };

  const handleGetBeerProductByIdAPI = async (id: number) => {
    const data = await getBeerProductByIdAPI(id);
    setSelectedBeerProduct(data.data);
    setShowDetailModal(true);
  };
  return (
    <>
      <BeerProductDetailModal
        showDetailModal={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        selectedBeerProduct={selectedBeerProduct}
        handleGetAllBeerProductsAPI={handleGetAllBeerProductsAPI}
      />
      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <div className="grid grid-col-1 sm:grid-cols-2 gap-4 ">
          <p className="text-3xl font-bold">Lô thành phẩm:</p>
          <div className="relative w-full lg:w-[150%]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-9"
              // value={searchItem}
              // onChange={(e) => setSearchItem(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row gap-5">
          <Button
            // onClick={() => setShowAddIngredientModal(true)}
            title="Thêm nguyên liệu mới"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition"
          >
            <FaPlus />
            <span className="hidden sm:inline">Thêm</span>
          </Button>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="bg-white text-base rounded-2xl shadow-md border border-gray-200 overflow-hidden my-3">
        <Table className="table-auto w-full text-base ">
          <TableHeader className="bg-gray-100 text-gray-800">
            <TableRow>
              <TableHead className="px-4 py-3 text-left">ID</TableHead>
              <TableHead className="px-4 py-3 text-left">Mã lô</TableHead>
              <TableHead className="px-4 py-3 text-left hidden 2xl:table-cell">
                Số lượng
              </TableHead>
              <TableHead className="px-4 py-3 text-left">Đơn vị</TableHead>
              <TableHead className="px-4 py-3 text-left ">Trạng thái</TableHead>
              <TableHead className="px-4 py-3 text-left ">
                Ngày sản xuất
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Ngày hết hạn
              </TableHead>
              <TableHead className="px-4 py-3 text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {beerProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground px-4 py-3"
                >
                  Không có nguyên liệu nào
                </TableCell>
              </TableRow>
            ) : (
              beerProducts.map((i, idx) => (
                <TableRow key={i.id}>
                  <TableCell className="px-4 py-3">{i.id}</TableCell>
                  <TableCell className="px-4 py-3">{i.code}</TableCell>
                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
                    {i.quantity}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {i.product?.unitType}
                  </TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    <Badge key={idx}>{i.status}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    {i.productionDate}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {i.expiryDate || "Chưa có"}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Button
                      title="Xem chi tiết nguyên liệu"
                      variant="outline"
                      onClick={() => handleGetBeerProductByIdAPI(i.id ?? 0)}
                      style={{ padding: "5px 10px", fontSize: "14px" }}
                    >
                      📋 <span className="hidden sm:inline">Chi tiết</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-center text-sm text-gray-500  mt-5">
        - - - Danh sách lô thành phẩm - - -
      </div>
    </>
  );
}
