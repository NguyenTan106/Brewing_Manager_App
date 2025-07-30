import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "@/services/login_API";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="username" className="mb-2">
              Tên đăng nhập
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Đăng nhập
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
