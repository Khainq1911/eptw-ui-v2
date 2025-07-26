import { Segmented } from "antd";
import React from "react";
import Login from "./components/login";
import Register from "./components/register";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/notification";

export default function AuthPage() {
  const [authOption, setAuthOption] = React.useState<"Login" | "Register">(
    "Login"
  );
  const navigate = useNavigate();
  const notify = useNotification();
  const authComponent = React.useMemo(() => {
    switch (authOption) {
      case "Login":
        return (
          <Login
            setAuthOption={setAuthOption}
            navigate={navigate}
            notify={notify}
          />
        );
      case "Register":
        return <Register setAuthOption={setAuthOption} />;
      default:
        return null;
    }
  }, [authOption]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EPTW</h1>
          <p>Chào mừng bạn đến với hệ thống</p>
        </div>
        <div>
          <Segmented
            options={["Login", "Register"]}
            block
            value={authOption}
            onChange={setAuthOption}
            className="!mb-4"
            size="large"
          />

          {authComponent}
        </div>
        <div className="mt-8 text-center">
          <div className="text-xs text-gray-500">
            © 2024 EPTW. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </div>
    </div>
  );
}
