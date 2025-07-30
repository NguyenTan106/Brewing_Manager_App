import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { type Ingredient } from "./CRUD_API_Ingredient";
import type { RecipeStep } from "./CRUD_API_Recipe";
export enum Status {
  mash = "mash",
  boiling = "boiling",
  fermenting = "fermenting",
  cold_crashing = "cold_crashing",
  done = "done",
  cancel = "cancel",
}

export interface BatchSteps {
  id: number;
  batchId: number;
  recipeStepId: number;
  stepOrder: number;
  startedAt: string;
  scheduledEndAt: string;
}
export const statusLabelMap: Record<Status, string> = {
  mash: "Ngâm và nấu mạch nha",
  boiling: "Nấu sôi",
  fermenting: "Lên men",
  cold_crashing: "Làm lạnh",
  done: "Hoàn tất",
  cancel: "Hủy",
};

export interface RecipeIngredient {
  id: number;
  ingredientId: number | string;
  amountNeeded: number | string;
  ingredient: Ingredient;
}

export interface BatchIngredient {
  id: number;
  ingredientId: number | string;
  amountUsed: number | string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: string;
  name: string;
  recipeIngredients: RecipeIngredient[];
  description?: string;
  note?: string;
  instructions?: string;
  createdAt: string;
  steps: RecipeStep[];
}

export interface UserInfo {
  username: string;
  phone: string;
  branch: string;
}

export interface Batch {
  id: number;
  code: string;
  beerName: string;
  status: Status;
  volume: number | string;
  notes?: string;
  recipeId?: number | string;
  createdById?: number;
  createdBy?: UserInfo;
  recipe: Recipe | null;
  createdAt?: string;
  batchIngredients: BatchIngredient[] | null;
  batchSteps: BatchSteps[];
}

type BatchUpdate = Omit<Batch, "volume" | "recipeId">;
type BatchInput = Omit<Batch, "id" | "code">;

export const getAllBatchesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/batches`);
  return res.data.data;
};

export const getBatchByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/batch/${id}`);
  console.log(res.data);
  return res.data.data;
};

export const createBatchAPI = async (data: BatchInput) => {
  const res = await axios.post(`${BASE_URL}/api/batch`, data);
  console.log(res.data);
  return res.data;
};

export const updateBatchByIdAPI = async (
  id: number,
  updatedData: Partial<BatchUpdate>
) => {
  const res = await axios.put(`${BASE_URL}/api/batch/${id}`, updatedData);
  return res.data;
};

// export const deleteBatchByIdAPI = async (id: number) => {
//   const res = await axios.delete(`${BASE_URL}/api/batch/${id}`);
//   return res.data;
// };
