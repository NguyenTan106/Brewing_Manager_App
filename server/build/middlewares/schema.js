"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.recipeSchema = exports.recipeUpdateSchema = exports.batchSchema = exports.typeSchema = exports.ingredientImportSchema = exports.ingredientSchema = void 0;
// src/validators/ingredient.validator.ts
const zod_1 = require("zod");
exports.ingredientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Tên không được để trống"),
    type: zod_1.z.string().min(1, "Loại không được để trống"),
    unit: zod_1.z.string().min(1, "Đơn vị không được để trống"),
    quantity: zod_1.z.number().min(0, "Số lượng phải >= 0"),
    lowStockThreshold: zod_1.z.number().min(0, "Ngưỡng cảnh báo phải >= 0"),
    lastImportDate: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Ngày không hợp lệ"), // hoặc z.date()
    notes: zod_1.z.string().optional(),
});
exports.ingredientImportSchema = zod_1.z.object({
    ingredientId: zod_1.z.preprocess((val) => Number(val), zod_1.z.number()),
    amount: zod_1.z.preprocess((val) => Number(val), zod_1.z.number()),
    totalCost: zod_1.z.preprocess((val) => Number(val), zod_1.z.number()),
    notes: zod_1.z.string().optional(),
    createdById: zod_1.z
        .number({
        error: "Người tạo không được để trống",
    })
        .min(1, "Người tạo không hợp lệ"),
});
exports.typeSchema = zod_1.z.object({
    typeName: zod_1.z.string().min(1, "Tên không được để trống"),
});
exports.batchSchema = zod_1.z.object({
    beerName: zod_1.z.string().min(1, "Tên không được để trống"),
    volume: zod_1.z.string().min(0, "Khối lượng mẻ không được để trống"),
    notes: zod_1.z.string().optional(),
    recipeId: zod_1.z.number().optional(),
    createdById: zod_1.z
        .number({
        error: "Người tạo không được để trống",
    })
        .min(1, "Người tạo không hợp lệ"),
});
exports.recipeUpdateSchema = zod_1.z.object({
    name: zod_1.z.string(),
    instructions: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    recipeIngredients: zod_1.z
        .array(zod_1.z.object({
        ingredientId: zod_1.z.preprocess((val) => Number(val), zod_1.z.number()),
        amountNeeded: zod_1.z.preprocess((val) => Number(val), zod_1.z.number()),
    }))
        .nonempty(),
    steps: zod_1.z
        .array(zod_1.z.object({
        recipeId: zod_1.z.number(),
        name: zod_1.z.string(),
        durationMinutes: zod_1.z.number(),
        stepOrder: zod_1.z.number().positive(),
    }))
        .nonempty(),
});
exports.recipeSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    instructions: zod_1.z.string().optional(),
    createdById: zod_1.z.number(),
    recipeIngredients: zod_1.z
        .array(zod_1.z.object({
        ingredientId: zod_1.z.preprocess((val) => Number(val), zod_1.z.number()),
        amountNeeded: zod_1.z.preprocess((val) => Number(val), zod_1.z.number()),
    }))
        .nonempty(),
    steps: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string(),
        durationMinutes: zod_1.z.number(),
        stepOrder: zod_1.z.number().positive(),
    }))
        .nonempty(),
});
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username không được để trống"),
    password: zod_1.z.string().min(1, "Password không được để trống"),
    role: zod_1.z.enum(["SUPER_ADMIN", "ADMIN"], {
        message: "Role không hợp lệ",
    }),
    phone: zod_1.z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
    email: zod_1.z.string().min(1, "Email không được để trống"),
    fullname: zod_1.z.string().min(1, "Họ tên không được để trống"),
    birthday: zod_1.z.string().min(1, "Sinh nhật không được để trống"),
    branch: zod_1.z.string().optional(),
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
