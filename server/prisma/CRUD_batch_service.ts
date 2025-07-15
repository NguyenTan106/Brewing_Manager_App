import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CRUD batchs
const getAllBatches = async (): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.batch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        batchIngredients: {
          include: {
            ingredient: true,
          },
        },
        recipe: true, // nếu muốn lấy luôn thông tin công thức liên kết
      },
    });
    if (data.length === 0) {
      return { message: "Chưa có mẻ nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mẻ nấu:", error);
    throw new Error("Lỗi server khi truy xuất mẻ nấu");
  }
};

const getBatchById = async (
  id: number
): Promise<{
  message: string;
  data: any;
}> => {
  try {
    const data = await prisma.batch.findUnique({
      where: { id },
    });
    if (!data) {
      return { message: "Chưa có mẻ nào được tạo", data: [] };
    }
    return {
      message: "Thành công",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mẻ nấu:", error);
    throw new Error("Lỗi server khi truy xuất mẻ nấu");
  }
};
// const create = async () => {
//   await prisma.batch.create({
//     data: {
//       code: "B001",
//       beerName: "IPA",
//       status: "boiling",
//       volume: 50,
//     },
//   });
// };

// create();
export { getAllBatches, getBatchById };
