import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface StockStatus {
  outOfStock: number;
  lowStock: number;
}

export const getTotalIngredientsAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/total-ingredients`);
  return res.data;
};

export const getIngredientStockStatusAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/total-ingredients-stock-status`);
  return res.data;
};
