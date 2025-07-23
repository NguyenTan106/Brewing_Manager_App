import { useEffect, useState } from "react";
import { TotalBatches } from "./BatchInfo/TotalBatches";
import { TotalIngredients } from "./IngredientInfo/TotalIngredients";
import { TotalRecipes } from "./RecipeInfo/TotalRecipes";
import { getTotalBatchesAPI } from "@/services/statistic_batch_API";
import { getTotalIngredientsAPI } from "@/services/statistic_ingredient_API";
import { getTotalRecipesAPI } from "@/services/statistic_recipe_API";
import { Card, CardContent } from "@/components/ui/card";
import { type TotalBatchesInfo } from "@/services/statistic_batch_API";
import { Label } from "@/components/ui/label";
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
      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <p className="text-2xl font-bold">Danh sách công thức:</p>
      </div>
      <Separator className="my-3" />
      <div className="flex flex-col 2xl:flex-row gap-3 my-3">
        <Card className="bg-white shadow-xl p-4 flex-2 min-w-[300px] w-full">
          <CardContent className="grid">
            <Label className="text-2xl font-bold">Thông tin mẻ</Label>
            <Separator className="my-2" />
            <TotalBatches totalBatches={totalBatches} />
          </CardContent>
        </Card>
        <div className="flex flex-col lg:flex-row gap-3">
          <Card className="bg-white shadow-xl p-4 flex-1 min-w-[250px] w-full">
            <CardContent className="grid">
              <Label className="text-2xl font-bold">
                Thông tin nguyên liệu
              </Label>
              <Separator className="my-2" />
              <TotalIngredients totalIngredients={totalIngredients} />
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl p-4 flex-1 min-w-[250px] w-full">
            <CardContent className="grid">
              <Label className="text-2xl font-bold">Thông tin công thức</Label>
              <Separator className="my-2" />
              <TotalRecipes totalRecipes={totalRecipes} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
