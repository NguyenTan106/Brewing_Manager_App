/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Batch_code_key" ON "Batch"("code");
