// src/validators/ingredient.validator.ts
import { StatusBeerProduct } from "@prisma/client";
import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  type: z.string().min(1, "Loại không được để trống"),
  unit: z.string().min(1, "Đơn vị không được để trống"),
  quantity: z.number().min(0, "Số lượng phải >= 0"),
  supplierId: z.number().min(0, "Nhà cung cấp không được để trống"),
  lowStockThreshold: z.number().min(0, "Ngưỡng cảnh báo phải >= 0"),
  lastImportDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày không hợp lệ"), // hoặc z.date()
  notes: z.string().optional(),
});

export const ingredientImportSchema = z.object({
  ingredientId: z.preprocess((val) => Number(val), z.number()),
  amount: z.preprocess((val) => Number(val), z.number()),
  totalCost: z.preprocess((val) => Number(val), z.number()),
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
  volume: z.string().min(0, "Khối lượng mẻ không được để trống"),
  notes: z.string().optional(),
  recipeId: z.number().optional(),
  createdById: z
    .number({
      error: "Người tạo không được để trống",
    })
    .min(1, "Người tạo không hợp lệ"),
});

export const recipeUpdateSchema = z.object({
  name: z.string(),
  instructions: z.string().optional(),
  note: z.string().optional(),
  description: z.string().optional(),
  recipeIngredients: z
    .array(
      z.object({
        ingredientId: z.preprocess((val) => Number(val), z.number()),
        amountNeeded: z.preprocess((val) => Number(val), z.number()),
      })
    )
    .nonempty(),
  steps: z
    .array(
      z.object({
        recipeId: z.number(),
        name: z.string(),
        durationMinutes: z.number(),
        stepOrder: z.number().positive(),
      })
    )
    .nonempty(),
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
        ingredientId: z.preprocess((val) => Number(val), z.number()),
        amountNeeded: z.preprocess((val) => Number(val), z.number()),
      })
    )
    .nonempty(),

  steps: z
    .array(
      z.object({
        name: z.string(),
        durationMinutes: z.number(),
        stepOrder: z.number().positive(),
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
  email: z.string().min(1, "Email không được để trống"),
  fullname: z.string().min(1, "Họ tên không được để trống"),
  birthday: z.string().min(1, "Sinh nhật không được để trống"),
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

export const supplierSchema = z.object({
  name: z.string().min(1, "Username không được để trống"),
  contactName: z.string().min(1, "Tên liên hệ không được để trống"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
  email: z.string().optional(),
  address: z.string().optional(),
});
export const beerProductSchema = z.object({
  batchId: z.number().min(1, "Batch ID không được để trống"),
  productId: z.number().min(1, "Product ID không được để trống"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
  productionDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày sản xuất không hợp lệ"),
  expiryDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày hết hạn không hợp lệ"),
  status: z.enum(StatusBeerProduct, {
    message: "Trạng thái không hợp lệ",
  }),
  createdById: z.number().min(1, "Người tạo không được để trống"),
  notes: z.string().optional(),
});
export const productSchema = z.object({
  code: z.string().min(1, "Mã sản phẩm không được để trống"),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  volume: z.number().min(1, "Thể tích sản phẩm phải lớn hơn 0"),
  unitType: z.string().min(1, "Đơn vị không được để trống"),
  description: z.string().optional(),
});
