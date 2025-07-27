import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Bạn cần cài `jwt-decode`
import type { JSX } from "react";
import { toast } from "sonner";
export interface JwtUserPayload {
  id: number;
  username: string;
  phone: string;
  role: "SUPER_ADMIN" | "ADMIN";
  exp?: number; // optional nếu bạn dùng expiresIn
  iat?: number;
}
const redirectToLogin = () => {
  localStorage.removeItem("token");
  return <Navigate to="/login" replace />;
};

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtUserPayload>(token);

    // Kiểm tra token hết hạn (nếu có trường `exp`)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return redirectToLogin();
    }

    return children;
  } catch (err) {
    // Token không hợp lệ (không decode được)
    const errorMessage = err instanceof Error ? err.message : String(err);
    toast.error("Token không hợp lệ: " + errorMessage);
    return redirectToLogin();
  }
}
