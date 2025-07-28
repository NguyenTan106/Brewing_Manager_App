/*
  Warnings:

  - You are about to drop the column `createdBy` on the `IngredientImport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "createdById" INTEGER;

-- AlterTable
ALTER TABLE "IngredientImport" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" INTEGER;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "IngredientImport" ADD CONSTRAINT "IngredientImport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
