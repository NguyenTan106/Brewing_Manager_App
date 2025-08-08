import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface Product {
  id?: number;
  code: string;
  name: string;
  volume: number; // Dung tích sản phẩm, có thể là số lượng hoặc thể tích tùy theo loại sản phẩm
  description?: string;
  unitType: string; // Loại đơn vị của sản phẩm (ví dụ: chai, thùng, v.v.)
  createdAt?: string; // Ngày tạo sản phẩm
  updatedAt?: string; // Ngày cập nhật sản phẩm
  beerProducts?: {
    id: number;
    batchId: number;
    quantity: number;
    productionDate: string;
    expiryDate: string;
    status: string;
    notes?: string;
  }[];
}

export const getAllProductsAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/products`);
  return res.data;
};
export const getProductByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/product/${id}`);
  return res.data;
};

export const createNewProductAPI = async (data: Product) => {
  const res = await axios.post(`${BASE_URL}/api/product`, data);
  return res.data;
};
