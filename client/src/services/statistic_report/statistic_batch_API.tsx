import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface TotalBatchesInfo {
  total: number;
  totalBatchesInFermenting: number;
  totalBatchesDone: number;
  totalBatchesCancel: number;
  byTime: {
    weeklyTotal: number;
    monthlyTotal: number;
    yearlyTotal: number;
  };
}

export const getTotalBatchesAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/total-batches`);
  return res.data;
};

export const getTotalBatchesByWeekMonthYearAPI = async () => {
  const res = await axios.get(
    `${BASE_URL}/api/total-batches-by-week-month-year`
  );
  return res.data;
};
