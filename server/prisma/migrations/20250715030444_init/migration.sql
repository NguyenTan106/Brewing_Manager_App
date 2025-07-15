/*
  Warnings:

  - A unique constraint covering the columns `[typeName]` on the table `Type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Type_typeName_key" ON "Type"("typeName");
