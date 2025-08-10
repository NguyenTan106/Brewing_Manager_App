import {
  getIngredientStockStatusAPI,
  type StockStatus,
} from "@/services/statistic_report/statistic_ingredient_API";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface Props {
  totalIngredients: number;
}

export function TotalIngredients({ totalIngredients }: Props) {
  const [ingredientStockStatus, setIngredientStockStatus] =
    useState<StockStatus | null>(null);

  useEffect(() => {
    handleGetIngredientStockStatusAPI();
  }, []);

  const handleGetIngredientStockStatusAPI = async () => {
    const status = await getIngredientStockStatusAPI();
    setIngredientStockStatus(status.data);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 pb-2">
      <Card className="w-full ">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-lg font-bold">
              Thống kê nguyên liệu
            </CardTitle>
            <CardDescription>Hiển thị tổng số nguyên liệu</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-center">
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">
                Tổng số nguyên liệu trong kho
              </p>
              <h2 className="text-4xl font-bold text-amber-700">
                {totalIngredients}
              </h2>
            </div>
            <div className="p-4 ">
              <p className="text-sm text-gray-500 mb-1">
                Tổng số nguyên liệu sắp hết
              </p>
              <h2 className="text-4xl font-bold text-amber-700">
                {ingredientStockStatus?.lowStock}
              </h2>
            </div>
            <div className="p-4 ">
              <p className="text-sm text-gray-500 mb-1">
                Tổng số nguyên liệu đã hết
              </p>
              <h2 className="text-4xl font-bold text-amber-700">
                {ingredientStockStatus?.outOfStock}
              </h2>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2"></CardFooter>
      </Card>
    </div>
  );
}
