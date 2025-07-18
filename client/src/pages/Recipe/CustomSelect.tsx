/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const customStyles = {
  control: (base: any, _state: any) => ({
    ...base,
    backgroundColor: "#f8f9fa", // tương đương bg-light
    border: "none", // border-0
    boxShadow: "0 .125rem .25rem rgba(0, 0, 0, 0.075)", // shadow-sm
    borderRadius: "0.25rem", // rounded
    minHeight: "30px", // nhỏ hơn mặc định, giống form-control-sm
    fontSize: "1rem", // nhỏ hơn (≈ 14px)
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
  }),
  option: (base: any, { isFocused, isSelected }: any) => ({
    ...base,
    backgroundColor: isSelected ? "#0d6efd" : isFocused ? "#e9ecef" : "#fff",
    color: isSelected ? "#fff" : "#212529",
    fontSize: "0.9rem",
    padding: "6px 12px",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.25rem",
    boxShadow: "0 .25rem .5rem rgba(0,0,0,.1)",
    zIndex: 9999,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#212529",
    fontSize: "1em",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#6c757d",
    fontSize: "1rem",
  }),
};
