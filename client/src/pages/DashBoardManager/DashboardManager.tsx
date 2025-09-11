import { useEffect, useState } from "react";
import { TotalBatches } from "./BatchInfo/TotalBatches";
import { TotalIngredients } from "./IngredientInfo/TotalIngredients";
import { TotalRecipes } from "./RecipeInfo/TotalRecipes";
import { getTotalBatchesAPI } from "@/services/statistic_report/statistic_batch_API";
import { getTotalIngredientsAPI } from "@/services/statistic_report/statistic_ingredient_API";
import { getTotalRecipesAPI } from "@/services/statistic_report/statistic_recipe_API";
import { type TotalBatchesInfo } from "@/services/statistic_report/statistic_batch_API";
import { Separator } from "@/components/ui/separator";

export default function DashBoardManager() {
  const [totalBatches, setTotalBatches] = useState<TotalBatchesInfo | null>(
    null
  );
  const [totalIngredients, setTotalIngredients] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);

  useEffect(() => {
    handleGetTotalBathesAPI();
    handleGetTotalIngredientsAPI();
    handleGetTotalRecipesAPI();
  }, []);

  const handleGetTotalBathesAPI = async () => {
    const total = await getTotalBatchesAPI();
    setTotalBatches(total.data);
  };
  const handleGetTotalIngredientsAPI = async () => {
    const total = await getTotalIngredientsAPI();
    setTotalIngredients(total.data);
  };
  const handleGetTotalRecipesAPI = async () => {
    const total = await getTotalRecipesAPI();
    setTotalRecipes(total.data);
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-2 mt-2">
        <p className="text-3xl font-bold">Tổng quan kho:</p>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-1 py-2 gap-3">
        <div>
          <TotalBatches totalBatches={totalBatches} />
        </div>
        <div>
          <TotalIngredients totalIngredients={totalIngredients} />
        </div>
        <div>
          <TotalRecipes totalRecipes={totalRecipes} />
        </div>
      </div>
    </>
  );
}
