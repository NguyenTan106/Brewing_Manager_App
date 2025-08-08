import { ZodError } from "zod";
import { Request, Response } from "express";

import {
  createNewBeerProduct,
  getAllBeerProducts,
  getBeerProductById,
} from "../../prisma/CRUD_Services/CRUD_beerProduct_service";

import { beerProductSchema } from "../../middlewares/schema";

const handleCreateNewBeerProduct = async (req: Request, res: Response) => {
  try {
    const parsed = beerProductSchema.parse(req.body);
    const result = await createNewBeerProduct(
      parsed.batchId,
      parsed.productId,
      parsed.quantity,
      parsed.productionDate,
      parsed.expiryDate,
      parsed.status,
      parsed.createdById,
      parsed.notes
    );
    res.status(200).json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      if (e instanceof ZodError) {
        const errMessage = e._zod.def;
        const err = errMessage.map((e) => e.message);
        console.error(
          "Lỗi trong controller handleCreateNewSupplier:",
          err.toString()
        );
        res.status(500).json({
          message: err.toString(),
        });
      }
    }
  }
};

const handleGetAllBeerProducts = async (req: Request, res: Response) => {
  try {
    const result = await getAllBeerProducts();
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllBeerProducts:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách lô sản phẩm bia",
    });
  }
};

const handleGetBeerProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await getBeerProductById(id);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleGetBeerProductById:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách lô sản phẩm bia",
    });
  }
};

export {
  handleCreateNewBeerProduct,
  handleGetAllBeerProducts,
  handleGetBeerProductById,
};
