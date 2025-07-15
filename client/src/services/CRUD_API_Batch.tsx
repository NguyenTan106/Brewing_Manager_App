import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllBatchesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/batches`);
  return res.data.data;
};

export const getAllBatchByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/batch/${id}`);
  return res.data.data;
};
