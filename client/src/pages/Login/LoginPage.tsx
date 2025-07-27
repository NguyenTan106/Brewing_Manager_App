import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "@/services/login_API";
import { toast } from "sonner";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await loginAPI({ username, password });
    try {
      const token = res.token;
      localStorage.setItem("token", token); // Lưu token
      if (token) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      navigate("/"); // Chuyển sang trang chính
    } catch (err) {
      console.log("Sai tài khoản hoặc mật khẩu", err);
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold">Đăng nhập</h1>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Đăng nhập
      </button>
    </div>
  );
}
