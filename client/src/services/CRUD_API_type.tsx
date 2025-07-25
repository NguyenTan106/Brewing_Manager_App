import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllTypesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/types`);
  return res.data.data;
};

export const createTypeAPI = async (typeName: string) => {
  const res = await axios.post(`${BASE_URL}/api/type`, { typeName });
  return res.data;
};

export const deleteTypeAPI = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/api/type/${id}`);
  return res.data;
};
