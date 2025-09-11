-- AddForeignKey
ALTER TABLE "BeerProduct" ADD CONSTRAINT "BeerProduct_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
