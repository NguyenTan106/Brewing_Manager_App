import { Request, Response } from "express";
import { computeTfIdf } from "../services/tfidfService";
import { getAllIngredients } from "../prisma/CRUD_Services/CRUD_ingredient_service";
import { getAllBatches } from "../prisma/CRUD_Services/CRUD_batch_service";
import { getAllRecipes } from "../prisma/CRUD_Services/CRUD_recipe_service";

export const searchIngredient = async (req: Request, res: Response) => {
  const query = req.body.query;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    // 👉 Lấy số lượng sách
    const total = await getAllIngredients();
    // ✅ Tính TF-IDF
    const tfidfResults = await computeTfIdf(query, total.data);
    // console.log(tfidfResults);
    const sorted = tfidfResults.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score
    );

    res.json(sorted);
  } catch (err) {
    console.error("Lỗi khi tìm nguyên liệu:", err);
    res.status(500).json({ error: "Không thể tìm nguyên liệu" });
  }
};

export const searchBatch = async (req: Request, res: Response) => {
  const query = req.body.query;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    // 👉 Lấy số lượng sách
    const total = await getAllBatches();
    // ✅ Tính TF-IDF
    const tfidfResults = await computeTfIdf(query, total.data);
    // console.log(tfidfResults);
    const sorted = tfidfResults.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score
    );

    res.json(sorted);
  } catch (err) {
    console.error("Lỗi khi tìm mẻ:", err);
    res.status(500).json({ error: "Không thể tìm mẻ" });
  }
};

export const searchRecipe = async (req: Request, res: Response) => {
  const query = req.body.query;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    // 👉 Lấy số lượng sách
    const total = await getAllRecipes();
    // ✅ Tính TF-IDF
    const tfidfResults = await computeTfIdf(query, total.data);
    // console.log(tfidfResults);
    const sorted = tfidfResults.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score
    );

    res.json(sorted);
  } catch (err) {
    console.error("Lỗi khi tìm công thức:", err);
    res.status(500).json({ error: "Không thể tìm công thức" });
  }
};
