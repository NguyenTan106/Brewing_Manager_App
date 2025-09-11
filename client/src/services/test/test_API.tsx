import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface TemperatureLog {
  id: number;
  batchId: number;
  temperature: number;
  timestamp: string;
}

export const getLatestTempAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/latest-temp`);
  return res.data;
};

export const getAllTempsAPI = async (batchId: number) => {
  const res = await axios.get(`${BASE_URL}/api/temps?batchId=${batchId}`);
  return res.data;
};
