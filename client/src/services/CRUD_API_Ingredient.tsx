import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

type Ingredient = {
  id: number;
  name: string;
  type: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  lastImportDate: string;
  notes?: string;
  status: string;
};

type IngredientInput = Omit<Ingredient, "id" | "status">;

export const getAllIngredientsAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/ingredients`);
  return res.data;
};

export const getIngredientByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/ingredient/${id}`);
  return res.data.data;
};

export const createIngredientAPI = async (data: IngredientInput) => {
  const res = await axios.post(`${BASE_URL}/api/ingredient/`, data);
  return res.data;
};

export const updateIngredientByIdAPI = async (
  id: number,
  updatedData: Partial<IngredientInput>
) => {
  const res = await axios.put(`${BASE_URL}/api/ingredient/${id}`, updatedData);
  return res.data; // thường là nguyên liệu đã được cập nhật
};

export const deleteIngredientByIdAPI = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/api/ingredient/${id}`);
  return res.data; // thường là thông báo thành công
};
