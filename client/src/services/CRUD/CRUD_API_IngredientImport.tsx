import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface ImportIngredient {
  ingredientId: string;
  amount: string;
  totalCost: string;
  notes?: string;
  createdById: number;
}

export const importIngredientAPI = async (data: ImportIngredient) => {
  const res = await axios.post(`${BASE_URL}/api/ingredient-imports`, data);
  return res.data;
};
