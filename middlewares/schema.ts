// src/validators/ingredient.validator.ts
import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  type: z.string().min(1, "Loại không được để trống"),
  unit: z.string().min(1, "Đơn vị không được để trống"),
  quantity: z.number().int().min(0, "Số lượng phải >= 0"),
  lowStockThreshold: z.number().int().min(0, "Ngưỡng cảnh báo phải >= 0"),
  lastImportDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày không hợp lệ"), // hoặc z.date()
  notes: z.string().optional(),
});
