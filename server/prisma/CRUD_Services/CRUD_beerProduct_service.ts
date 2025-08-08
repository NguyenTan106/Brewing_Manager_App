import { PrismaClient, StatusBeerProduct } from "@prisma/client";
const prisma = new PrismaClient();
import { format } from "date-fns-tz";

const createNewBeerProduct = async (
  batchId: number,
  productId: number,
  quantity: number,
  productionDate: string,
  expiryDate: string,
  status: StatusBeerProduct,
  createdById: number,
  notes?: string
): Promise<{ message: string; data: any }> => {
  try {
    // 1. Tạo mã tự động
    const vnNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    const datePrefix = format(vnNow, "ddMMyy");

    const todayStart = new Date(vnNow);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(vnNow);
    todayEnd.setHours(23, 59, 59, 999);

    const todayBatches = await prisma.batch.findMany({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const countToday = todayBatches.length + 1;
    const serial = String(countToday).padStart(2, "0");
    const newCode = `BP${datePrefix}-${serial}`;

    const newBeerProduct = await prisma.beerProduct.create({
      data: {
        code: newCode,
        batchId: Number(batchId),
        productId: Number(productId),
        quantity: Number(quantity),
        productionDate,
        expiryDate,
        status,
        createdById: Number(createdById),
        notes,
      },
    });

    return {
      message: "Thêm sản phẩm bia mới thành công",
      data: newBeerProduct,
    };
  } catch (e) {
    console.error("Lỗi khi tạo sản phẩm bia mới:", e);
    throw new Error("Không thể thêm sản phẩm bia mới");
  }
};

const getAllBeerProducts = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.beerProduct.findMany({
      where: { isDeleted: false },
      include: {
        batch: true,
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (data.length === 0) {
      return { message: "Chưa có lô sản phẩm nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lô sản phẩm:", error);
    throw new Error("Lỗi server khi truy suất danh sách lô sản phẩm");
  }
};

const getBeerProductById = async (
  id: number
): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.beerProduct.findFirst({
      where: { id, isDeleted: false },
      include: {
        batch: true,
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!data) {
      return { message: "Không tìm thấy lô sản phẩm nào", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy lô sản phẩm:", error);
    throw new Error("Lỗi server khi truy suất lô sản phẩm");
  }
};

export { createNewBeerProduct, getAllBeerProducts, getBeerProductById };
