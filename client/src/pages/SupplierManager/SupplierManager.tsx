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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import type { Supplier } from "@/services/CRUD/CRUD_API_Supplier";
import {
  getAllSuppliersAPI,
  getSupplierByIdAPI,
} from "@/services/CRUD/CRUD_API_Supplier";
import AddNewSupplier from "./AddNewSupplier";
import SupplierDetailModal from "./SupplierDetailModal";

export default function SupplierManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showAddNewSupplierModal, setShowAddNewSupplierModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  useEffect(() => {
    handleGetAllSuppliersAPI();
  }, []);
  useEffect(() => {
    if (selectedSupplier?.id != null) {
      const item = suppliers.find((e) => e.id === selectedSupplier.id);
      if (item && JSON.stringify(item) !== JSON.stringify(selectedSupplier)) {
        setSelectedSupplier(item);
      }
    }
  }, [suppliers]);

  const handleGetAllSuppliersAPI = async () => {
    const data = await getAllSuppliersAPI();
    setSuppliers(data.data);
  };

  const handleGetSupplierByIdAPI = async (id: number) => {
    const data = await getSupplierByIdAPI(id);
    setSelectedSupplier(data.data);
    setShowDetailModal(true);
  };
  return (
    <>
      <SupplierDetailModal
        showDetailModal={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        handleGetAllSuppliersAPI={handleGetAllSuppliersAPI}
        selectedSupplier={selectedSupplier}
      />
      <AddNewSupplier
        showAddNewSupplierModal={showAddNewSupplierModal}
        handleClose={() => setShowAddNewSupplierModal(false)}
        handleGetAllSuppliersAPI={handleGetAllSuppliersAPI}
      />

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
          Danh sách nhà cung cấp:
        </p>

        <div className="relative w-full sm:w-72 flex gap-3">
          <div>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-9"
              // value={searchItem}
              // onChange={(e) => setSearchItem(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setShowAddNewSupplierModal(true)}
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
                Tên nhà cung cấp
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden 2xl:table-cell">
                Tên liên hệ
              </TableHead>
              <TableHead className="px-4 py-3 text-left ">
                Số điện thoại
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Email
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Địa chỉ
              </TableHead>

              <TableHead className="px-4 py-3 text-left "></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground px-4 py-3"
                >
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="px-4 py-3">{i.id}</TableCell>
                  <TableCell className="px-4 py-3">{i.name}</TableCell>
                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
                    {i.contactName}
                  </TableCell>
                  <TableCell className="px-4 py-3">{i.phone}</TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    {i.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    {i.address}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      title="Xem chi tiết nguyên liệu"
                      variant="outline"
                      onClick={() => handleGetSupplierByIdAPI(i.id ? i.id : 0)}
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
        - - - Danh sách nhà cung cấp - - -
      </div>
    </>
  );
}
