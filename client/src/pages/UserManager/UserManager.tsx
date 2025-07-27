import { getAllUsersAPI, type User } from "@/services/CRUD/CRUD_API_User";
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
export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    handleGetAllUserAPI();
  }, []);

  const handleGetAllUserAPI = async () => {
    const data = await getAllUsersAPI();
    setUsers(data.data);
  };
  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <div className="grid grid-col-1 sm:grid-cols-2 gap-4 ">
          <p className="text-3xl font-bold">Danh sách người dùng:</p>
          <div className="relative w-full lg:w-[150%]">
            <Search className="fixed translate-x-3 translate-y-3/5 h-4 w-4 text-muted-foreground" />
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
                Tên người dùng
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden 2xl:table-cell">
                Vai trò
              </TableHead>
              <TableHead className="px-4 py-3 text-left">Chi nhánh</TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Ngày tạo
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Ngày cập nhật
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-gray-100 px-4 py-3"
                >
                  Không có nguyên liệu nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="px-4 py-3">{i.id}</TableCell>
                  <TableCell className="px-4 py-3">{i.username}</TableCell>
                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
                    {i.role}
                  </TableCell>
                  <TableCell className="px-4 py-3">{i.branch}</TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    {new Date(i.createdAt).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    {new Date(i.updatedAt).toLocaleString("vi-VN", {
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-center text-sm text-gray-500  mt-5">
        - - - Danh sách người dùng - - -
      </div>
    </>
  );
}
