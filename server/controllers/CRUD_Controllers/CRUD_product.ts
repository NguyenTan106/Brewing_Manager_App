import { ZodError } from "zod";
import { Request, Response } from "express";
import {
  createNewProduct,
  getAllProducts,
  getProductById,
} from "../../prisma/CRUD_Services/CRUD_product_service";
import { productSchema } from "../../middlewares/schema";

const handleCreateNewProduct = async (req: Request, res: Response) => {
  try {
    const parsed = productSchema.parse(req.body);
    const result = await createNewProduct(
      parsed.code,
      parsed.name,
      parsed.volume,
      parsed.unitType,
      parsed.description
    );
    res.status(200).json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      if (e instanceof ZodError) {
        const errMessage = e._zod.def;
        const err = errMessage.map((e) => e.message);
        console.error(
          "Lỗi trong controller handleCreateNewProduct:",
          err.toString()
        );
        res.status(500).json({
          message: err.toString(),
        });
      }
    }
  }
};

const handleGetAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await getAllProducts();
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllBeerProducts:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách loại sản phẩm bia",
    });
  }
};

const handleGetProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await getProductById(id);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleGetProductById:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách loại sản phẩm bia",
    });
  }
};

export { handleCreateNewProduct, handleGetAllProducts, handleGetProductById };
