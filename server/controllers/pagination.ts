import { Request, Response } from "express";

import { getIngredientPage } from "../prisma/CRUD_ingredient_service";
import { getBatchPage } from "../prisma/CRUD_batch_service";

export const handlePaginationIngredient = async (
  req: Request,
  res: Response
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await getIngredientPage(page, limit);

  res.json(result);
};

export const handlePaginationBatch = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await getBatchPage(page, limit);

  res.json(result);
};
