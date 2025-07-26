import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const searchIngredientAPI = async (query: string) => {
  const res = await axios.post(`${BASE_URL}/api/search-ingredient`, {
    query: query,
  });
  return res.data;
};

export const searchBatchAPI = async (query: string) => {
  const res = await axios.post(`${BASE_URL}/api/search-batch`, {
    query: query,
  });
  return res.data;
};

export const searchRecipeAPI = async (query: string) => {
  const res = await axios.post(`${BASE_URL}/api/search-recipe`, {
    query: query,
  });
  return res.data;
};
