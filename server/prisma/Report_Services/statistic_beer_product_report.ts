import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getTotalBeerProducts = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const total = await prisma.beerProduct.count({
      where: { isDeleted: false },
    });

    if (total === 0) {
      return {
        message: "Chưa có lô sản phẩn nào được tạo",
        data: { totalBeerProducts: 0 },
      };
    }
    return {
      message: "Thành công",
      data: { totalBeerProducts: total },
    };
  } catch (error) {
    console.error("Lỗi khi tính tổng lô sản phẩm:", error);
    throw new Error("Lỗi server khi tính tổng lô sản phẩm");
  }
};

export { getTotalBeerProducts };
