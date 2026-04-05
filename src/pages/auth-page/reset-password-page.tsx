import { useState, useEffect } from "react";
import { App, Button, Input } from "antd";
import { LockOutlined, ClockCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authHandler } from "./auth-page-service";
import Logo from "@/components/logo";
import { routesConfig } from "@/configs/routes";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { notification } = App.useApp();
  
  const [resetForm, setResetForm] = useState({
    token: token || "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      await authHandler.resetPassword(e, resetForm, navigate, notification);
    } catch (err) {
      // Error is handled in authHandler's notification
    } finally {
      setLoading(false);
    }
  };

  // Decode JWT to get 'exp'
  const getExpiryFromToken = (token: string | null) => {
    if (!token) return 0;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      return decoded.exp || 0;
    } catch (e) {
      console.error("Failed to decode token", e);
      return 0;
    }
  };

  // Calculate initial time left based on decoded 'exp'
  const getInitialTimeLeft = () => {
    const expiryTime = getExpiryFromToken(token);
    if (!expiryTime) return 0;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const diff = expiryTime - currentTime;
    
    return diff > 0 ? diff : 0;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft()); 

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">Lỗi: Thiếu Token</h2>
          <p className="text-gray-600 mb-6">Liên kết khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.</p>
          <Button type="primary" onClick={() => navigate(routesConfig.AuthRoute)}>
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-blue-900/5">
          <div className="flex flex-col items-center mb-8">
            <div className="transform scale-[1.3] mb-4">
              <Logo />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-wider">E-PTW</h1>
            <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase mt-1">
              ELECTRONIC PERMIT TO WORK
            </p>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
            <div className={`mt-2 flex items-center justify-center gap-2 font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-orange-500'}`}>
              <ClockCircleOutlined />
              <span>Thời gian còn lại: {formatTime(timeLeft)}</span>
            </div>
          </div>

          <form
            className="gap-4 flex flex-col"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <label htmlFor="new-password" title="Mật khẩu mới" className="font-bold text-gray-700">
                Mật khẩu mới
              </label>
              <div className="relative">
                <LockOutlined className="!absolute !z-10 !left-3 !top-2.5 !text-gray-400" />
                <Input.Password
                  id="new-password"
                  placeholder={timeLeft <= 0 ? "Mã xác thực đã hết hạn" : "Nhập mật khẩu mới"}
                  className="!pl-10 !h-10"
                  required
                  disabled={timeLeft <= 0 || loading}
                  value={resetForm.password}
                  onChange={(e) => setResetForm({...resetForm, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" title="Xác nhận mật khẩu" className="font-bold text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <LockOutlined className="!absolute !z-10 !left-3 !top-2.5 !text-gray-400" />
                <Input.Password
                  id="confirm-password"
                  placeholder={timeLeft <= 0 ? "Mã xác thực đã hết hạn" : "Nhập lại mật khẩu mới"}
                  className="!pl-10 !h-10"
                  required
                  disabled={timeLeft <= 0 || loading}
                  value={resetForm.confirmPassword}
                  onChange={(e) => setResetForm({...resetForm, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="primary" 
              size="large" 
              htmlType="submit" 
              className="!mt-2 !h-11 font-semibold shadow-lg shadow-blue-900/10"
              loading={loading}
              disabled={timeLeft <= 0}
            >
              {timeLeft <= 0 ? "Token đã hết hạn" : "Cập nhật mật khẩu"}
            </Button>
          </form>

          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(routesConfig.AuthRoute)}
            className="w-full mt-4 text-gray-500"
          >
            Quay lại đăng nhập
          </Button>

          <div className="border-t border-gray-100 mt-6 pt-6 text-center text-[10px] text-gray-400 uppercase tracking-widest">
            © 2024 EPTW. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </div>
    </div>
  );
}
