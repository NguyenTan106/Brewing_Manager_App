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
  createdById: z
    .number({
      error: "Người tạo không được để trống",
    })
    .min(1, "Người tạo không hợp lệ"),
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
  createdById: z
    .number({
      error: "Người tạo không được để trống",
    })
    .min(1, "Người tạo không hợp lệ"),
  stepStartedAt: z.string().min(1, "Yêu cầu chọn thời gian hoàn thành"),
});

export const recipeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  note: z.string().optional(),
  instructions: z.string().optional(),
  createdById: z.number(),

  recipeIngredients: z
    .array(
      z.object({
        ingredientId: z.number(),
        amountNeeded: z.number(),
      })
    )
    .nonempty(),

  recipeSteps: z
    .array(
      z.object({
        name: z.string(),
        durationMinutes: z.number().positive(),
      })
    )
    .nonempty(),
});

export const userSchema = z.object({
  username: z.string().min(1, "Username không được để trống"),
  password: z.string().min(1, "Password không được để trống"),
  role: z.enum(["SUPER_ADMIN", "ADMIN"], {
    message: "Role không hợp lệ",
  }),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
  branch: z.string().optional(),
});
// .refine(
//   (data) => {
//     // Nếu là ADMIN thì phải có branch
//     if (data.role === "ADMIN") {
//       return data.branch && data.branch.trim() !== "";
//     }
//     return true;
//   },
//   {
//     message: "Branch là bắt buộc với tài khoản ADMIN",
//     path: ["branch"],
//   }
// );
