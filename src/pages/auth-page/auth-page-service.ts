import type { NavigateFunction } from "react-router-dom";
import { loginService } from "@/services/authService";
import type { LoginFormType, NotificationContextType } from "@/common/type";

export const login = async (
  e: React.FormEvent<HTMLFormElement>,
  loginForm: LoginFormType,
  navigate: NavigateFunction,
  notify: (
    type: NotificationContextType,
    message: string,
    description?: string
  ) => void
) => {
  e.preventDefault();

  try {
    const res = await loginService(loginForm);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    navigate("/home");
    notify("success", "Đăng nhập thành công", "Chào mừng bạn trở lại!");
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
