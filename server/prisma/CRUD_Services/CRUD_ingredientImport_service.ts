import { Ingredient, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const importIngredient = async (importData: {
  ingredientId: number;
  amount: number;
  totalCost: number;
  notes: string | null;
  createdById: number;
}): Promise<{ message: string; data: any }> => {
  const existing = await prisma.ingredient.findFirst({
    where: {
      id: importData.ingredientId,
      isDeleted: false,
    },
  });

  if (!existing) {
    return {
      message: "Nguyên liệu không tồn tại",
      data: null,
    };
  }

  if (importData.amount <= 0 || importData.totalCost <= 0) {
    return {
      message: "Số lượng và tổng giá trị phải lớn hơn 0",
      data: null,
    };
  }

  const updateQuantity = importData.amount + existing.quantity;
  const unitCost = importData.totalCost / importData.amount;

  const [imported] = await prisma.$transaction([
    // 1. Tạo bản ghi nhập kho
    prisma.ingredientImport.create({
      data: importData,
      include: {
        ingredient: true,
        createdBy: true,
      },
    }),
    // 2. Cập nhật tồn kho
    prisma.ingredient.update({
      where: { id: importData.ingredientId },
      data: {
        quantity: updateQuantity,
        lastImportDate: new Date(),
      },
    }),
    // 3. Ghi lại đơn giá cost
    prisma.ingredientCostHistory.create({
      data: {
        ingredientId: importData.ingredientId,
        cost: unitCost,
        note:
          `Nhập ${
            importData.amount
          } đơn vị với ${importData.totalCost.toLocaleString()} VND` +
          (importData.notes ? ` - ${importData.notes}` : ""),
        createdAt: new Date(),
      },
    }),
  ]);

  return {
    message: "Nhập kho thành công",
    data: {
      ...imported,
      unitCost,
    },
  };
};

export { importIngredient };
