import { App } from "antd";
import React from "react";
import Login from "./components/login";
import ForgotPassword from "./components/forgot-password";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [authOption, setAuthOption] = React.useState<"Login" | "ForgotPassword">(
    "Login"
  );
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const authComponent = React.useMemo(() => {
    switch (authOption) {
      case "Login":
        return (
          <Login
            setAuthOption={setAuthOption}
            navigate={navigate}
            notification={notification}
          />
        );
      case "ForgotPassword":
        return (
          <ForgotPassword
            setAuthOption={setAuthOption}
            notification={notification}
          />
        );
      default:
        return null;
    }
  }, [authOption, navigate, notification]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="transition-all duration-300 ease-in-out">
          {authComponent}
        </div>
      </div>
    </div>
  );
}
