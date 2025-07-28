import { jwtDecode } from "jwt-decode"; // Bạn cần cài `jwt-decode`
import { type JwtUserPayload } from "./RequireAuth";

export const checkUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode<JwtUserPayload>(token);
    const id = decoded.id;
    const role = decoded.role;
    const username = decoded.username;
    const phone = decoded.phone;
    // console.log({ role, username, phone });
    return { id, role, username, phone };
  }
};
// export const showUsername = () => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     const decoded = jwtDecode<JwtUserPayload>(token);
//     const username = decoded.username;
//     console.log(username);
//     return username;
//   }
// };
