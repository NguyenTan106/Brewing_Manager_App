import { Request, Response } from "express";
import {
  getTotalRecipes,
  getTotalRecipesMostUsed,
  getTotalRecipesRecentlyUpdated,
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

const handleGetTotalRecipesMostUsed = async (req: Request, res: Response) => {
  try {
    const handle = await getTotalRecipesMostUsed();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetTotalRecipesMostUsed:", e);
    res.status(500).json({
      message: "Lỗi server khi tính tổng công thức được dùng nhiều nhất",
    });
  }
};

const handleGetTotalRecipesRecentlyUpdated = async (
  req: Request,
  res: Response
) => {
  try {
    const handle = await getTotalRecipesRecentlyUpdated();
    res.status(200).json(handle);
  } catch (e) {
    console.error(
      "Lỗi trong controller handleGetTotalRecipesRecentlyUpdated:",
      e
    );
    res.status(500).json({
      message: "Lỗi server khi tính tổng công thức được cập nhật gần đây",
    });
  }
};

export {
  handleGetTotalRecipes,
  handleGetTotalRecipesMostUsed,
  handleGetTotalRecipesRecentlyUpdated,
};
