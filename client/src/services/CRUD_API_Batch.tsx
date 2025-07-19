import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { type Ingredient } from "./CRUD_API_Ingredient";
export enum Status {
  boiling = "boiling",
  fermenting = "fermenting",
  cold_crashing = "cold_crashing",
  done = "done",
}

export const statusLabelMap: Record<Status, string> = {
  boiling: "Nấu sôi",
  fermenting: "Lên men",
  cold_crashing: "Làm lạnh",
  done: "Hoàn tất",
};

export interface RecipeIngredient {
  id: number;
  ingredientId: number | string;
  amountNeeded: number | string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: number;
  name: string;
  recipeIngredients: RecipeIngredient[];
  description?: string;
  note?: string;
  instructions?: string;
  createdAt: string;
}

export interface Batch {
  id: number;
  code: string;
  beerName: string;
  status: Status;
  volume: number | string;
  notes?: string;
  recipeId?: number | string;
  recipe: Recipe;
  createdAt?: string;
}
type BatchInput = Omit<Batch, "id" | "code">;

export const getAllBatchesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/batches`);
  return res.data.data;
};

export const getAllBatchByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/batch/${id}`);
  return res.data.data;
};

export const createBatchAPI = async (data: BatchInput) => {
  const res = await axios.post(`${BASE_URL}/api/batch`, data);
  return res.data;
};

export const updateBatchByIdAPI = async (
  id: number,
  updatedData: Partial<Batch>
) => {
  const res = await axios.put(`${BASE_URL}/api/batch/${id}`, updatedData);
  return res.data;
};

export const deleteBatchByIdAPI = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/api/batch/${id}`);
  return res.data;
};
