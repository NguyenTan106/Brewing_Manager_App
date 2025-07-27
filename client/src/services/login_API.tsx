import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface LoginInput {
  username: string;
  password: string;
}

export const loginAPI = async (data: LoginInput) => {
  const res = await axios.post(`${BASE_URL}/api/user-login`, data);
  //   console.log(res.data);
  return res.data;
};
