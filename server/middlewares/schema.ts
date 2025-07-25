// src/validators/ingredient.validator.ts
import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  type: z.string().min(1, "Loại không được để trống"),
  unit: z.string().min(1, "Đơn vị không được để trống"),
  quantity: z.number().min(0, "Số lượng phải >= 0"),
  lowStockThreshold: z.number().min(0, "Ngưỡng cảnh báo phải >= 0"),
  lastImportDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày không hợp lệ"), // hoặc z.date()
  notes: z.string().optional(),
});

export const ingredientImportSchema = z.object({
  ingredientId: z.preprocess((val) => Number(val), z.number()),
  amount: z.preprocess((val) => Number(val), z.number()),
  notes: z.string().optional(),
  createdBy: z.string().optional(),
});

export const typeSchema = z.object({
  typeName: z.string().min(1, "Tên không được để trống"),
});

export const batchSchema = z.object({
  beerName: z.string().min(1, "Tên không được để trống"),
  status: z.string().min(1, "Yêu cầu chọn trạng thái"),
  volume: z.string().min(0, "Khối lượng mẻ không được để trống"),
  notes: z.string().optional(),
  recipeId: z.number().optional(),
});

export const recipeSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  recipeIngredients: z.array(
    z.object({
      ingredientId: z.preprocess((val) => Number(val), z.number()),
      amountNeeded: z.preprocess(
        (val) => Number(val),
        z.number().nonnegative()
      ),
    })
  ),
  description: z.string().optional(),
  note: z.string().optional(),
  instructions: z.string().optional(),
});
