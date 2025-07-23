import axios from "axios";
import type { Recipe } from "./CRUD_API_Recipe";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface RecipeMostUsed {
  recipe: Recipe;
  usedCount: number;
}

export const getTotalRecipesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/total-recipes`);
  return res.data;
};

export const getTotalRecipesMostUsedAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/total-recipes-most-used`);
  return res.data;
};
export const getTotalRecipesRecentlyUpdatedAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/total-recipes-recently-updated`);
  return res.data;
};
