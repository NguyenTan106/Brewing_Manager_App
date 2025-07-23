import type { JSX } from "react";

export const getIngredientIcon = (type: string): JSX.Element => {
  switch (type) {
    case "Ngũ cốc":
      return <span>🌾</span>;
    case "Hoa bia":
      return <span>🌿</span>;
    case "Men bia":
      return <span>🫧</span>;
    case "Nước":
      return <span>💧</span>;
    case "Phụ gia":
      return <span>🧂</span>;
    default:
      return <span>📦</span>;
  }
};
export const getBadgeClass = (status: string) => {
  switch (status) {
    case "Đủ":
      return "bg-green-500 text-white hover:bg-green-600";
    case "Sắp hết":
      return "bg-yellow-400 text-black hover:bg-yellow-500";
    case "Hết":
      return "bg-red-500 text-white hover:bg-red-600";
    default:
      return "bg-gray-200 text-black";
  }
};
