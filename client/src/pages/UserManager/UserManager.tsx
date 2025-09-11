import {
  getAllUsersAPI,
  getUserByIdAPI,
  type User,
} from "@/services/CRUD/CRUD_API_User";
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
import AddNewUserModal from "./AddNewUserModal";
import UserDetailModal from "./UserDetailModal";
export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddNewUserModal, setShowAddNewUserModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  useEffect(() => {
    handleGetAllUserAPI();
  }, []);

  useEffect(() => {
    if (selectedUser?.id != null) {
      const item = users.find((e) => e.id === selectedUser.id);
      if (item && JSON.stringify(item) !== JSON.stringify(selectedUser)) {
        setSelectedUser(item);
      }
    }
  }, [users]);
  const handleGetAllUserAPI = async () => {
    const data = await getAllUsersAPI();
    setUsers(data.data);
  };

  const handleGetUserByIdAPI = async (id: number) => {
    const data = await getUserByIdAPI(id);
    setSelectedUser(data.data);
    setShowDetailModal(true);
  };
  return (
    <>
      <AddNewUserModal
        showAddNewUserModal={showAddNewUserModal}
        handleClose={() => setShowAddNewUserModal(false)}
        handleGetAllUserAPI={handleGetAllUserAPI}
      />
      <UserDetailModal
        selectedUser={selectedUser}
        handleClose={() => setShowDetailModal(false)}
        showDetailModal={showDetailModal}
        handleGetAllUserAPI={handleGetAllUserAPI}
        setSelectedUser={setSelectedUser}
      />

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
          Danh sách người dùng:
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
            onClick={() => setShowAddNewUserModal(true)}
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
              <TableHead className="px-4 py-3 text-left ">
                Số điện thoại
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Chi nhánh
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden lg:table-cell">
                Ngày tạo
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden 2xl:table-cell">
                Ngày cập nhật
              </TableHead>
              <TableHead className="px-4 py-3 text-left "></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground px-4 py-3"
                >
                  Không có người dùng nào
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
                  <TableCell className="px-4 py-3">{i.phone}</TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    {i.branch}
                  </TableCell>
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
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
                  <TableCell className="px-4 py-3 hidden 2xl:table-cell">
                    {i.updatedAt &&
                      new Date(i.updatedAt).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour12: false,
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      title="Xem chi tiết nguyên liệu"
                      variant="outline"
                      onClick={() => handleGetUserByIdAPI(i.id ? i.id : 0)}
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
        - - - Danh sách người dùng - - -
      </div>
    </>
  );
}
