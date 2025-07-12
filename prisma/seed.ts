import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

async function main() {
  // await prisma.ingredient.deleteMany();
  await prisma.ingredient.create({
    data: {
      name: "Cascade",
      type: "hop",
      unit: "g",
      quantity: 850,
      lowStockThreshold: 500,
      lastImportDate: "2025-07-01T00:00:00Z",
      notes: "Dùng cho IPA, hương cam chanh mạnh",
      createdAt: "2025-07-01T10:15:00Z",
      updatedAt: "2025-07-01T10:15:00Z",
    },
  });
}

main()
  .then(() => {
    console.log(`successfully`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
