import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllTypesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/types`);
  return res.data.data;
};
