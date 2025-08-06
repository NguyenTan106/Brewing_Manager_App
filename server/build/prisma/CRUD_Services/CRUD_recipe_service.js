"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipePage = exports.deleteRecipeById = exports.updateRecipeById = exports.getRecipeById = exports.createRecipe = exports.getAllRecipes = void 0;
const client_1 = require("@prisma/client");
const pagination_1 = require("../pagination");
const prisma = new client_1.PrismaClient();
// CRUD recipe
const getAllRecipes = async () => {
    try {
        const data = await prisma.recipe.findMany({
            include: {
                recipeIngredients: {
                    include: { ingredient: true },
                },
                createdBy: true,
                steps: {
                    orderBy: { stepOrder: "asc" }, // đảm bảo thứ tự bước
                },
            },
            orderBy: { createdAt: "desc" },
            where: {
                isDeleted: false,
            },
        });
        const result = data.map((recipe) => ({
            ...recipe,
            recipeIngredients: recipe.recipeIngredients.filter((ri) => !ri.ingredient.isDeleted),
        }));
        if (result.length === 0) {
            return { message: "Chưa có công thức nào được tạo", data: [] };
        }
        return {
            message: "Thành công",
            data: result,
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách công thức:", error);
        throw new Error("Lỗi server khi truy xuất công thức");
    }
};
exports.getAllRecipes = getAllRecipes;
const getRecipeById = async (id) => {
    try {
        const data = await prisma.recipe.findUnique({
            where: {
                id,
                isDeleted: false,
            },
            include: {
                recipeIngredients: {
                    include: { ingredient: true },
                },
                createdBy: true,
                steps: {
                    orderBy: { stepOrder: "asc" }, // đảm bảo thứ tự bước
                },
            },
        });
        if (!data) {
            return { message: "Không tìm thấy công thức", data: null };
        }
        const filteredIngredients = data.recipeIngredients.filter((i) => !i.ingredient.isDeleted);
        return {
            message: "Thành công",
            data: {
                ...data,
                recipeIngredients: filteredIngredients,
            },
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy công thức theo ID:", error);
        throw new Error("Lỗi server khi truy xuất công thức");
    }
};
exports.getRecipeById = getRecipeById;
const createRecipe = async (name, recipeIngredients, steps, createdById, description, note, instructions) => {
    try {
        // ✅ Kiểm tra trùng tên
        const existing = await prisma.recipe.findUnique({
            where: { name },
        });
        if (existing) {
            return {
                message: `Công thức "${name}" đã tồn tại`,
                data: null,
            };
        }
        // ✅ Kiểm tra nguyên liệu
        if (!recipeIngredients || recipeIngredients.length === 0) {
            return {
                message: "Danh sách nguyên liệu không hợp lệ",
                data: null,
            };
        }
        // ✅ Kiểm tra bước
        if (!steps || steps.length === 0) {
            return {
                message: "Danh sách bước thực hiện không hợp lệ",
                data: null,
            };
        }
        // ✅ Tạo recipe trước
        const newRecipe = await prisma.recipe.create({
            data: {
                name,
                description: description || null,
                note: note || null,
                instructions: instructions || null,
                createdById,
                recipeIngredients: {
                    create: recipeIngredients.map((ing) => ({
                        ingredientId: ing.ingredientId,
                        amountNeeded: ing.amountNeeded,
                    })),
                },
            },
        });
        // ✅ Tạo recipeSteps liên kết với recipe mới
        await prisma.recipeStep.createMany({
            data: steps.map((step) => ({
                recipeId: Number(newRecipe.id),
                name: step.name,
                durationMinutes: Number(step.durationMinutes),
                stepOrder: step.stepOrder, // dùng index làm thứ tự
            })),
        });
        // ✅ Lấy lại recipe đầy đủ để trả về
        const fullRecipe = await prisma.recipe.findUnique({
            where: { id: newRecipe.id },
            include: {
                recipeIngredients: {
                    include: {
                        ingredient: true,
                    },
                },
                steps: true,
                createdBy: true,
            },
        });
        return {
            message: "Thêm công thức thành công",
            data: fullRecipe,
        };
    }
    catch (e) {
        console.error("Lỗi khi tạo công thức mới:", e);
        throw new Error("Không thể thêm công thức mới");
    }
};
exports.createRecipe = createRecipe;
const updateRecipeById = async (id, name, description, note, instructions, recipeIngredients, steps) => {
    try {
        const existing = await prisma.recipe.findUnique({
            where: { id, isDeleted: false },
            include: {
                recipeIngredients: true,
            },
        });
        if (!existing) {
            return { message: "Không tìm thấy công thức", data: [] };
        }
        // Nếu có truyền vào danh sách nguyên liệu mới
        if (recipeIngredients && Array.isArray(recipeIngredients)) {
            const currentIngredients = existing.recipeIngredients;
            const newIds = recipeIngredients.map((ri) => ri.ingredientId);
            // ✅ Xóa nguyên liệu không còn trong danh sách mới
            const toDelete = currentIngredients.filter((ri) => !newIds.includes(ri.ingredientId));
            for (const ri of toDelete) {
                await prisma.recipeIngredient.delete({
                    where: { id: ri.id },
                });
            }
            // ✅ Thêm mới hoặc cập nhật nguyên liệu
            for (const newRI of recipeIngredients) {
                const existingRI = currentIngredients.find((ri) => ri.ingredientId === newRI.ingredientId);
                if (existingRI) {
                    if (existingRI.amountNeeded !== newRI.amountNeeded) {
                        // ✅ Cập nhật số lượng nếu khác
                        await prisma.recipeIngredient.update({
                            where: { id: existingRI.id },
                            data: {
                                amountNeeded: Number(newRI.amountNeeded),
                            },
                        });
                    }
                }
                else {
                    // ✅ Thêm mới nếu chưa có
                    await prisma.recipeIngredient.create({
                        data: {
                            recipeId: id,
                            ingredientId: newRI.ingredientId,
                            amountNeeded: Number(newRI.amountNeeded),
                        },
                    });
                }
            }
        }
        // Nếu có truyền vào danh sách bước mới
        if (steps && Array.isArray(steps)) {
            const recipeIdNumber = Number(id);
            // Lấy danh sách các stepOrder hiện tại trong DB
            const existingSteps = await prisma.recipeStep.findMany({
                where: { recipeId: recipeIdNumber },
                select: { stepOrder: true },
            });
            const incomingStepOrders = steps.map((s) => s.stepOrder);
            const stepOrdersToDelete = existingSteps
                .map((s) => s.stepOrder)
                .filter((stepOrder) => !incomingStepOrders.includes(stepOrder));
            // Xóa các step không còn tồn tại
            if (stepOrdersToDelete.length > 0) {
                await prisma.recipeStep.deleteMany({
                    where: {
                        recipeId: recipeIdNumber,
                        stepOrder: { in: stepOrdersToDelete },
                    },
                });
            }
            // Cập nhật hoặc thêm mới
            for (const step of steps) {
                await prisma.recipeStep.upsert({
                    where: {
                        // 👇 đây phải là khóa duy nhất
                        recipeId_stepOrder: {
                            recipeId: Number(id),
                            stepOrder: step.stepOrder,
                        },
                    },
                    update: {
                        name: step.name,
                        durationMinutes: step.durationMinutes,
                    },
                    create: {
                        recipeId: Number(id),
                        stepOrder: step.stepOrder,
                        name: step.name,
                        durationMinutes: step.durationMinutes,
                    },
                });
            }
        }
        // ✅ Cập nhật thông tin chung của recipe
        const updated = await prisma.recipe.update({
            where: { id },
            data: {
                name,
                description,
                note,
                instructions,
                updatedAt: new Date(),
            },
            include: {
                recipeIngredients: {
                    include: {
                        ingredient: true,
                    },
                },
                steps: true,
            },
        });
        return {
            message: "Cập nhật công thức thành công",
            data: updated,
        };
    }
    catch (e) {
        console.error("Lỗi khi cập nhật công thức:", e);
        throw new Error("Không thể cập nhật công thức");
    }
};
exports.updateRecipeById = updateRecipeById;
const deleteRecipeById = async (id) => {
    try {
        const existing = await prisma.recipe.findUnique({
            where: { id },
        });
        if (!existing) {
            return { message: "Không tim thấy công thức", data: [] };
        }
        // ✅ Xóa các liên kết nguyên liệu trước
        const deleted = await prisma.recipe.update({
            where: { id },
            data: { isDeleted: true },
        });
        return {
            message: "Xóa công thức thành công",
            data: deleted,
        };
    }
    catch (e) {
        console.error("Lỗi khi xóa công thức:", e);
        throw new Error("Không thể xóa công thức");
    }
};
exports.deleteRecipeById = deleteRecipeById;
const getRecipePage = async (page, limit) => {
    return (0, pagination_1.paginate)({
        page,
        limit,
        model: "recipe",
        where: { isDeleted: false },
        include: {
            recipeIngredients: {
                include: { ingredient: true },
            },
            createdBy: true,
            steps: {
                orderBy: { stepOrder: "asc" }, // đảm bảo thứ tự bước
            },
        },
        orderBy: { createdAt: "desc" },
        enhanceItem: async (i) => ({
            ...i,
        }),
        useSoftDelete: true,
    });
};
exports.getRecipePage = getRecipePage;
