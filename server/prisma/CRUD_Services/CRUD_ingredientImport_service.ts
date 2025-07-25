import { Ingredient, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const importIngredient = async (importData: {
  ingredientId: number;
  amount: number;
  notes: string | null;
  createdBy: string | null;
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

  if (importData.amount <= 0) {
    return {
      message: "Số lượng nhập phải lớn hơn 0",
      data: null,
    };
  }

  const updateQuantity = importData.amount + existing.quantity;

  const [imported] = await prisma.$transaction([
    prisma.ingredientImport.create({ data: importData }),
    prisma.ingredient.update({
      where: { id: importData.ingredientId },
      data: {
        quantity: updateQuantity,
        lastImportDate: new Date(),
      },
    }),
  ]);

  return {
    message: "Nhập kho thành công",
    data: imported,
  };
};

export { importIngredient };
