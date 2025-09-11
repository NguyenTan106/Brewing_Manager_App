import { PrismaClient, RecipeStep, Supplier } from "@prisma/client";
import { format } from "date-fns-tz";
import { paginate } from "../pagination";
const prisma = new PrismaClient();

const createNewSupplier = async (
  name: string,
  contactName: string,
  phone: string,
  email?: string,
  address?: string
): Promise<{ message: string; data: any }> => {
  try {
    // ✅ Kiểm tra trùng tên
    const existing = await prisma.supplier.findUnique({
      where: { name },
    });

    if (existing) {
      return {
        message: `${name.toUpperCase()} đã tồn tại`,
        data: null,
      };
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        contactName,
        phone,
        email,
        address,
      },
    });

    return {
      message: "Thêm nhà cung cấp thành công",
      data: newSupplier,
    };
  } catch (e) {
    console.error("Lỗi khi tạo nhà cung cấp mới:", e);
    throw new Error("Không thể thêm nhà cung mới");
  }
};

const getAllSuppliers = async (): Promise<{ message: string; data: any }> => {
  try {
    const data = await prisma.supplier.findMany({
      where: { isDeleted: false },
    });

    if (data.length === 0) {
      return { message: "Chưa có nhà cung cấp nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    throw new Error("Lỗi server khi truy suất nhà cung cấp");
  }
};

const getSupplierById = async (
  id: number
): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.supplier.findFirst({
      where: { id, isDeleted: false },
    });

    if (!data) {
      return { message: "Không tìm thấy nhà cung cấp", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy nhà cung cấp:", error);
    throw new Error("Lỗi server khi truy suất nhà cung cấp");
  }
};

const updateSupplierById = async (
  id: number,
  updateData: Partial<Supplier>
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.supplier.findUnique({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return {
        message: `Không tìm thấy nhà cung cấp với ID = ${id}`,
        data: null,
      };
    }

    const updated = await prisma.supplier.update({
      where: { id },
      data: updateData,
    });

    return {
      message: "Cập nhật nhà cung cấp thành công",
      data: updated,
    };
  } catch (e) {
    console.error("Lỗi khi cập nhật nhà cung cấp:", e);
    throw new Error("Không thể cập nhà cung cấp");
  }
};

const deleteSupplierById = async (
  id: number
): Promise<{ message: string; data: any }> => {
  try {
    const existing = await prisma.supplier.findUnique({ where: { id } });

    if (!existing) {
      return {
        message: `Không tìm thấy nhà cung cấp với ID = ${id}`,
        data: null,
      };
    }

    const deleted = await prisma.supplier.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return {
      message: "Xóa nhà cung cấp thành công",
      data: deleted,
    };
  } catch (e) {
    console.error("Lỗi khi xóa nhà cung cấp:", e);
    throw new Error("Không thể xóa nhà cung cấp");
  }
};
export {
  createNewSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
};
