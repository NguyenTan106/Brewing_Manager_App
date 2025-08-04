-- CreateTable
CREATE TABLE "IngredientCostHistory" (
    "id" SERIAL NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "IngredientCostHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IngredientCostHistory_ingredientId_createdAt_idx" ON "IngredientCostHistory"("ingredientId", "createdAt");

-- AddForeignKey
ALTER TABLE "IngredientCostHistory" ADD CONSTRAINT "IngredientCostHistory_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
