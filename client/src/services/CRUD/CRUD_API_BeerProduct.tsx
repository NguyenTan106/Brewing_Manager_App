import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface BeerProduct {
  id?: number;
  code: string;
  batchId: number;
  productId: number;
  quantity: number;
  productionDate: string;
  expiryDate: string;
  status: BeerProductStatus;
  notes?: string;
  createdById?: number; // ID của người tạo lô sản phẩm, nếu có
  createdAt?: string; // Ngày tạo lô sản phẩm
  updatedAt?: string; // Ngày cập nhật lô sản phẩm
  product?: {
    id: number;
    name: string;
    unitType: string; // Loại đơn vị của sản phẩm (ví dụ: chai, thùng, v.v.)
  };
  batch?: {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
  };
}

export enum BeerProductStatus {
  available = "Có sẵn",
  exported = "Đã xuất kho",
  faulty = "Lỗi / Hỏng",
  expired = "Hết hạn",
  reserved = "Đã đặt trước", // Sản phẩm chưa xuất kho ngay nhưng đã được giữ chỗ cho một đơn hàng cụ thể.
}

export const getAllBeerProductsAPI = async () => {
  const res = await axios.get(`${BASE_URL}/api/beer-products`);
  return res.data;
};
export const getBeerProductByIdAPI = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/api/beer-product/${id}`);
  return res.data;
};

export const createNewBeerProductAPI = async (data: BeerProduct) => {
  const res = await axios.post(`${BASE_URL}/api/beer-product`, data);
  return res.data;
};
