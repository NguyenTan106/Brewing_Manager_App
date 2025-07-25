/*
  Warnings:

  - A unique constraint covering the columns `[name,isDeleted]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ingredient_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_isDeleted_key" ON "Ingredient"("name", "isDeleted");
