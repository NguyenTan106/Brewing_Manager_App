/*
  Warnings:

  - A unique constraint covering the columns `[batchId]` on the table `BeerProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BeerProduct_batchId_key" ON "BeerProduct"("batchId");
