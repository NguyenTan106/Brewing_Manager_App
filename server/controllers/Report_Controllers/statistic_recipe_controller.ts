import { Request, Response } from "express";
import {
  getTotalRecipes,
  getTop5RecipesMostUsed,
  getTop5RecipesRecentlyUpdated,
} from "../../prisma/Report_Services/statistic_recipe_report";

const handleGetTotalRecipes = async (req: Request, res: Response) => {
  try {
    const handle = await getTotalRecipes();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetTotalRecipes:", e);
    res.status(500).json({
      message: "Lỗi server khi tính tổng công thức",
    });
  }
};

const handleGetTop5RecipesMostUsed = async (req: Request, res: Response) => {
  try {
    const handle = await getTop5RecipesMostUsed();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetTop5RecipesMostUsed:", e);
    res.status(500).json({
      message: "Lỗi server khi tính tổng công thức được dùng nhiều nhất",
    });
  }
};

const handleGetTop5RecipesRecentlyUpdated = async (
  req: Request,
  res: Response
) => {
  try {
    const handle = await getTop5RecipesRecentlyUpdated();
    res.status(200).json(handle);
  } catch (e) {
    console.error(
      "Lỗi trong controller handleGetTop5RecipesRecentlyUpdated:",
      e
    );
    res.status(500).json({
      message: "Lỗi server khi tính tổng công thức được cập nhật gần đây",
    });
  }
};

export {
  handleGetTotalRecipes,
  handleGetTop5RecipesMostUsed,
  handleGetTop5RecipesRecentlyUpdated,
};
