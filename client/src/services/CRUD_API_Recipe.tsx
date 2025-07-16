import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  note?: string;
  instructions?: string;
  createdAt: string;
}
type RecipeInput = Omit<Recipe, "id" | "createdAt">;

export const getAllRecipesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/recipes`);
  return res.data.data;
};

export const getAllRecipeByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/recipe/${id}`);
  return res.data.data;
};

export const createRecipeAPI = async (data: RecipeInput) => {
  const res = await axios.post(`${BASE_URL}/api/recipe`, data);
  return res.data;
};

export const updateRecipeByIdAPI = async (
  id: number,
  updatedData: Partial<Recipe>
) => {
  const res = await axios.put(`${BASE_URL}/api/recipe/${id}`, updatedData);
  return res.data;
};

export const deleteRecipeByIdAPI = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/api/recipe/${id}`);
  return res.data;
};
