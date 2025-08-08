import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface Supplier {
  id?: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

export const getAllSuppliersAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/suppliers`);
  return res.data;
};
export const getSupplierByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/supplier/${id}`);
  return res.data;
};

export const createNewSupplierAPI = async (data: Supplier) => {
  const res = await axios.post(`${BASE_URL}/api/supplier`, data);
  return res.data;
};
export const updateSupplierByIdAPI = async (
  id: number,
  data: Partial<Supplier>
) => {
  const res = await axios.put(`${BASE_URL}/api/supplier/${id}`, data);
  return res.data;
};
export const deleteSupplierByIdAPI = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/api/supplier/${id}`);
  return res.data;
};
