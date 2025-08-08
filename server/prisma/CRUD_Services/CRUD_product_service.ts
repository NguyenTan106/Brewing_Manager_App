import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createNewProduct = async (
  code: string,
  name: string,
  volume: number,
  unitType: string,
  description?: string
): Promise<{ message: string; data: any }> => {
  try {
    const newBeerProduct = await prisma.product.create({
      data: {
        code,
        name,
        volume: Number(volume),
        unitType,
        description,
      },
    });

    return {
      message: "Thêm loại sản phẩm bia thành công",
      data: newBeerProduct,
    };
  } catch (e) {
    console.error("Lỗi khi tạo loại sản phẩm bia:", e);
    throw new Error("Không thể thêm loại sản phẩm bia");
  }
};

const getAllProducts = async (): Promise<{ message: string; data: any }> => {
  try {
    const data = await prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        beerProducts: {
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (data.length === 0) {
      return { message: "Chưa có loại sản phẩm nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
    throw new Error("Lỗi server khi truy suất danh sách loại sản phẩm");
  }
};

const getProductById = async (
  id: number
): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.product.findFirst({
      where: { id, isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        beerProducts: {
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!data) {
      return { message: "Không tìm thấy loại sản phẩm nào", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy loại sản phẩm:", error);
    throw new Error("Lỗi server khi truy suất loại sản phẩm");
  }
};

export { createNewProduct, getAllProducts, getProductById };
