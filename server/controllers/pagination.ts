import { Request, Response } from "express";

import { pagination } from "../prisma/CRUD_ingredient_service";

export const handlePagination = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await pagination(page, limit);

  res.json(result);
};
