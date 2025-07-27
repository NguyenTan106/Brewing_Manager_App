import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
}

export interface User {
  id: number;
  username: string;
  role: Role;
  branch: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getAllUsersAPI = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
