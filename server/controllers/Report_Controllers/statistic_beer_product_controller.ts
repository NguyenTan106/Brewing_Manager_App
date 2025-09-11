import { Request, Response } from "express";
import { getTotalBeerProducts } from "../../prisma/Report_Services/statistic_beer_product_report";

const handleGetTotalBeerProducts = async (req: Request, res: Response) => {
  try {
    const handle = await getTotalBeerProducts();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetTotalRecipes:", e);
    res.status(500).json({
      message: "Lỗi server khi tính tổng công thức",
    });
  }
};

export { handleGetTotalBeerProducts };
