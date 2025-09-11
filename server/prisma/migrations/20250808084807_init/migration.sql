-- AddForeignKey
ALTER TABLE "BeerProduct" ADD CONSTRAINT "BeerProduct_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
