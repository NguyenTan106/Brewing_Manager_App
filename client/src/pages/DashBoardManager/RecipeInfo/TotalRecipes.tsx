import type { Recipe } from "@/services/CRUD/CRUD_API_Recipe";
import {
  getTotalRecipesMostUsedAPI,
  getTotalRecipesRecentlyUpdatedAPI,
  type RecipeMostUsed,
} from "@/services//statistic_report/statistic_recipe_API";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  totalRecipes: number;
}

export function TotalRecipes({ totalRecipes }: Props) {
  const [recipeMostUsed, setRecipeMostUsed] = useState<RecipeMostUsed[]>([]);
  const [recipeRecentlyUpdated, setRecipeRecentlyUpdated] = useState<Recipe[]>(
    []
  );
  useEffect(() => {
    handleGetTotalRecipesMostUsedAPI();
    handleGetTotalRecipesRecentlyUpdatedAPI();
  }, []);

  const handleGetTotalRecipesMostUsedAPI = async () => {
    const data = await getTotalRecipesMostUsedAPI();
    setRecipeMostUsed(data.data);
  };
  const handleGetTotalRecipesRecentlyUpdatedAPI = async () => {
    const data = await getTotalRecipesRecentlyUpdatedAPI();
    setRecipeRecentlyUpdated(data.data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 pb-2">
      <Card className="w-full ">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-lg font-bold">
              Thống kê công thức
            </CardTitle>
            <CardDescription>Hiển thị tổng số công thức</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-1 text-center">
            {/* Tổng số công thức */}
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">
                Tổng số công thức đã tạo
              </p>
              <h2 className="text-4xl font-bold text-amber-700">
                {totalRecipes}
              </h2>
            </div>

            {/* Top 5 công thức được dùng nhiều */}
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">
                🏆 Top 5 công thức được dùng nhiều nhất
              </p>
              <ul className="text-base text-amber-800 font-medium space-y-1 list-decimal list-inside">
                {recipeMostUsed?.map((i) => (
                  <li key={i.recipe.id}>
                    {i.recipe.name} —{" "}
                    <span className="font-semibold">{i.usedCount}</span> mẻ
                  </li>
                ))}
              </ul>
            </div>

            {/* Top 5 công thức cập nhật gần đây */}
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">
                🕒 Top 5 công thức mới cập nhật gần đây
              </p>
              <ul className="text-base text-amber-800 font-medium space-y-1 list-decimal list-inside">
                {recipeRecentlyUpdated?.map((i) => (
                  <li key={i.id}>
                    {i.name} —{" "}
                    <span className="text-gray-600 font-normal">
                      {i.updatedAt &&
                        new Date(i.updatedAt).toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                          hour12: false,
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2"></CardFooter>
      </Card>
    </div>
  );
}
