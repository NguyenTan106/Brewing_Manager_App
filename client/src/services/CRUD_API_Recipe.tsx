import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { type Ingredient } from "./CRUD_API_Ingredient";

export interface RecipeIngredient {
  id: number;
  ingredientId: number | string;
  amountNeeded: number | string;
  ingredient: Ingredient;
}

export interface RecipeIngredientInput {
  ingredientId: string | number;
  amountNeeded: string | number;
}

export interface RecipeIngredientUpdate {
  ingredientId: string | number;
  amountNeeded: string | number;
  ingredient: {
    id: number;
    name: string;
    unit: string;
  };
}

export interface Recipe {
  id: number;
  name: string;
  recipeIngredients: RecipeIngredientInput[];
  description?: string;
  note?: string;
  instructions?: string;
  createdAt: string;
}

export interface RecipeUpate {
  id: number;
  name: string;
  recipeIngredients: RecipeIngredientUpdate[];
  description?: string;
  note?: string;
  instructions?: string;
  createdAt: string;
}

type RecipeInput = Omit<Recipe, "id" | "createdAt">;

export const getAllRecipesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/recipes`);
  // console.log(res.data.data);
  return res.data.data;
};

export const getRecipeByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/recipe/${id}`);
  return res.data.data;
};

export const createRecipeAPI = async (data: RecipeInput) => {
  const res = await axios.post(`${BASE_URL}/api/recipe`, data);
  return res.data;
};

export const updateRecipeByIdAPI = async (
  id: number,
  updatedData: Partial<RecipeUpate>
) => {
  const res = await axios.put(`${BASE_URL}/api/recipe/${id}`, updatedData);
  return res.data;
};

export const deleteRecipeByIdAPI = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/api/recipe/${id}`);
  return res.data;
};
