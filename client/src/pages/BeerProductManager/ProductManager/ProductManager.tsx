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
  getAllProductsAPI,
  getProductByIdAPI,
  type Product,
} from "@/services/CRUD/CRUD_API_Product";
import ProductDetailModal from "./ProductDetailModal";

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddNewProductModal, setShowAddNewProductModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    handleGetAllProductsAPI();
  }, []);

  useEffect(() => {
    if (selectedProduct?.id != null) {
      const item = products.find((e) => e.id === selectedProduct.id);
      if (item && JSON.stringify(item) !== JSON.stringify(selectedProduct)) {
        setSelectedProduct(item);
      }
    }
  }, [products]);

  const handleGetAllProductsAPI = async () => {
    const data = await getAllProductsAPI();
    setProducts(data.data);
  };

  const handleGetProductByIdAPI = async (id: number) => {
    const data = await getProductByIdAPI(id);
    setSelectedProduct(data.data);
    setShowDetailModal(true);
  };

  return (
    <>
      <ProductDetailModal
        showDetailModal={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        selectedProduct={selectedProduct}
        handleGetAllProductsAPI={handleGetAllProductsAPI}
      />
      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <div className="grid grid-col-1 sm:grid-cols-2 gap-4 ">
          <p className="text-3xl font-bold">Danh mục sản phẩm:</p>
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
              <TableHead className="px-4 py-3 text-left">
                Tên loại bia
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden 2xl:table-cell">
                Thể tích (ml/lít)
              </TableHead>
              <TableHead className="px-4 py-3 text-left">Đơn vị</TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Mô tả
              </TableHead>
              <TableHead className="px-4 py-3 text-left ">Ngày tạo</TableHead>
              <TableHead className="px-4 py-3 text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground px-4 py-3"
                >
                  Không có nguyên liệu nào
                </TableCell>
              </TableRow>
            ) : (
              products.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="px-4 py-3">{i.id}</TableCell>
                  <TableCell className="px-4 py-3">{i.name}</TableCell>
                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
                    {i.volume}
                  </TableCell>
                  <TableCell className="px-4 py-3">{i.unitType}</TableCell>
                  <TableCell className="px-4 py-3">{i.description}</TableCell>
                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
                    {i.createdAt &&
                      new Date(i.createdAt).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour12: false,
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </TableCell>

                  <TableCell className="px-4 py-3 ">
                    <Button
                      title="Xem chi tiết"
                      variant="outline"
                      onClick={() => handleGetProductByIdAPI(i.id ?? 0)}
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
        - - - Danh mục sản phẩm - - -
      </div>
    </>
  );
}
