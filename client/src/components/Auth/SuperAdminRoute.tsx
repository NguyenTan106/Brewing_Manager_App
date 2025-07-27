// components/auth/SuperAdminRoute.tsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { JSX } from "react";
import { type JwtUserPayload } from "./RequireAuth";

export default function SuperAdminRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtUserPayload>(token);
    // console.log(decoded.role);

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return <Navigate to="/login" replace />;
    }

    if (decoded.role !== "SUPER_ADMIN") {
      return <Navigate to="/" replace />; // Hoặc return null;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
