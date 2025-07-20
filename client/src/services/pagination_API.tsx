import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const paginationIngredientAPI = async (page = 1, limit = 10) => {
  const res = await axios.get(
    `${BASE_URL}/api/pagination-ingredient?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const paginationBatchAPI = async (page = 1, limit = 10) => {
  const res = await axios.get(
    `${BASE_URL}/api/pagination-batch?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const paginationRecipeAPI = async (page = 1, limit = 10) => {
  const res = await axios.get(
    `${BASE_URL}/api/pagination-recipe?page=${page}&limit=${limit}`
  );
  return res.data;
};
