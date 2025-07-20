import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface ActivityLog {
  id: number;
  action: string;
  entity: string;
  entityId: number;
  description: string;
  timestamp: string;
  userId?: string;
}

export const getAllActivityLogsAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/activity-logs`);
  return res.data.data;
};
