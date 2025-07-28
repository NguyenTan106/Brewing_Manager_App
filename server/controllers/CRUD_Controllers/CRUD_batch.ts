import { Request, Response } from "express";
import { Status } from "@prisma/client";
import { ZodError } from "zod";
import { compareAndLogChanges } from "../../services/logActivityService";
import {
  getAllBatches,
  getBatchById,
  createBatch,
  deleteBacthById,
  updateBatchById,
} from "../../prisma/CRUD_Services/CRUD_batch_service";
import { batchSchema } from "../../middlewares/schema";
import { logActivity } from "../../prisma/logActivity";
const handleGetAllBatches = async (req: Request, res: Response) => {
  try {
    const handle = await getAllBatches();
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetAllBatchs:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm mẻ",
    });
  }
};

const handleGetBatchById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const handle = await getBatchById(id);
    res.status(200).json(handle);
  } catch (e) {
    console.error("Lỗi trong controller handleGetBatchById:", e);
    res.status(500).json({
      message: "Lỗi server khi tìm mẻ",
    });
  }
};

const handleCreateBatch = async (req: Request, res: Response) => {
  try {
    const parsed = batchSchema.parse(req.body);

    const result = await createBatch(
      parsed.beerName,
      parsed.status as Status,
      Number(parsed.volume),
      parsed.notes || "",
      Number(parsed.recipeId),
      Number(parsed.createdById)
    );
    const data = result.data;
    res.status(201).json(result);
    if (data.length === 0) {
      return "Mẻ đang chưa được tạo";
    }
    const logCreatedAt = new Date(data.createdAt).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    await logActivity(
      "create",
      "Batch",
      data.id,
      `Thêm mẻ "${data.beerName}": ${data.volume}L với trạng thái ${data.status} bởi ${data.createdBy.username} vào ngày ${logCreatedAt}`
      // userId // nếu có
    );
  } catch (e) {
    if (e instanceof ZodError) {
      const errMessage = e._zod.def;
      const err = errMessage.map((e) => e.message);
      console.error("Lỗi trong controller handleCreateBatch:", err.toString());
      res.status(500).json({
        message: err.toString(),
      });
    }
  }
};

const handleUpdateBatchById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { beerName, status, notes } = req.body;

    const oldResult = await getBatchById(Number(id));

    const result = await updateBatchById(id, {
      beerName: beerName,
      status: status,
      notes: notes,
    });

    const oldData = oldResult.data;
    const newData = result.data;

    res.status(200).json(result);
    await compareAndLogChanges(
      oldData,
      newData,
      ["beerName", "status", "volume", "notes", "recipeId"],
      "Batch",
      newData.id,
      oldData.beerName
      // userId // nếu có
    );
  } catch (e) {
    console.error("Lỗi trong controller handleUpdateBatchById:", e);
    res.status(500).json({
      message: "Lỗi server khi cập nhật mẻ",
    });
  }
};

const handleDeleteBacthById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const logDeleteDate = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const deleted = await deleteBacthById(id);
    res.status(200).json(deleted);
    const data = deleted.data;
    await logActivity(
      "delete",
      "Batch",
      data.id,
      `Xóa mẻ ${data.code}: "${data.beerName}": ${data.volume}L vào ngày ${logDeleteDate}`
      // userId // nếu có
    );
  } catch (e) {
    console.error("Lỗi trong controller handleDeleteBacthById:", e);
    res.status(500).json({
      message: "Lỗi server khi xóa mẻ",
    });
  }
};

export {
  handleGetAllBatches,
  handleGetBatchById,
  handleCreateBatch,
  handleDeleteBacthById,
  handleUpdateBatchById,
};
