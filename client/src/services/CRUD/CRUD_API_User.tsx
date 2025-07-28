import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
}

export interface User {
  id?: number;
  username: string;
  role: Role;
  phone: string;
  branch?: string | null;
  createdAt?: string;
  updatedAt?: string;
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

export const getUserByIdAPI = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/api/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createNewUserAPI = async (data: User) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(`${BASE_URL}/api/create-user`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateUserByIdAPI = async (id: number, data: Partial<User>) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(`${BASE_URL}/api/update-user/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteUserByIdAPI = async (id: number, currentUserId: number) => {
  const token = localStorage.getItem("token");

  const res = await axios.delete(`${BASE_URL}/api/delete-user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      currentUserId, // truyền vào body của request
    },
  });
  return res.data;
};
