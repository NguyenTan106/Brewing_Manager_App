import type { JSX } from "react";

export const getIngredientIcon = (type: string): JSX.Element => {
  switch (type) {
    case "malt":
      return <span>🌾</span>;
    case "hop":
      return <span>🌿</span>;
    case "yeast":
      return <span>🫧</span>;
    case "water":
      return <span>💧</span>;
    default:
      return <span>📦</span>;
  }
};
