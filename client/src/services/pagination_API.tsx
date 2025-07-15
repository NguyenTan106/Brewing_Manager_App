import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const paginationAPI = async (page = 1, limit = 10) => {
  const res = await axios.get(
    `${BASE_URL}/api/pagination?page=${page}&limit=${limit}`
  );
  return res.data;
  //   setIngredients(data.data);
  //   setCurrentPage(data.currentPage);
  //   setTotalPages(data.totalPages);
};
