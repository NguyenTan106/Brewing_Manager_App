import { ZodError } from "zod";
import { Request, Response } from "express";
import {
  createNewSupplier,
  deleteSupplierById,
  getAllSuppliers,
  getSupplierById,
  updateSupplierById,
} from "../../prisma/CRUD_Services/CRUD_supplier_service";
import { supplierSchema } from "../../middlewares/schema";

const handleCreateNewSupplier = async (req: Request, res: Response) => {
  try {
    const parsed = supplierSchema.parse(req.body);
    const result = await createNewSupplier(
      parsed.name,
      parsed.contactName,
      parsed.phone,
      parsed.email,
      parsed.address
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

const handleGetAllSuppliers = async (req: Request, res: Response) => {
  try {
    const result = await getAllSuppliers();
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllSuppliers:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách nhà cung cấp",
    });
  }
};

const handleGetSupplierById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await getSupplierById(id);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllSuppliers:", e);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách nhà cung cấp",
    });
  }
};

const handleUpdateSupplierById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await updateSupplierById(id, req.body);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleUpdateSupplierById:", e);
    res.status(500).json({
      message: "Lỗi server khi cập nhật nhà cung cấp",
    });
  }
};

const handleDeleteSupplierById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteSupplierById(id);
    res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi trong controller handleDeleteSupplierById:", e);
    res.status(500).json({
      message: "Lỗi server khi xóa nhà cung cấp",
    });
  }
};

export {
  handleCreateNewSupplier,
  handleGetAllSuppliers,
  handleGetSupplierById,
  handleDeleteSupplierById,
  handleUpdateSupplierById,
};
