export const checkInventoryService = async (
  unit: number,
  lowStockThreshold: number
) => {
  let status = "";
  if (unit == 0) {
    status = "Không còn";
  } else if (unit > lowStockThreshold) {
    status = "Còn";
  } else {
    status = "Sắp hết";
  }
  return status;
};
