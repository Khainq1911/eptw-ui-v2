import { authService } from "@/services/authService";
import type { NavigateFunction } from "react-router-dom";
import type {
  LoginFormType,
  NotificationContextType,
  RegisterDataType,
  RegisterFormType,
} from "@/common/type";
import type { SetStateAction } from "react";
import { AxiosError } from "axios";
import { routesConfig } from "@/configs/routes";

export const authHandler = {
  login: async (
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
      const res = await authService.login(loginForm);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      navigate(routesConfig.HomeRoute);
      notify("success", "Đăng nhập thành công", "Chào mừng bạn trở lại!");
    } catch (error) {
      notify("error", "Đăng nhập thất bại", "Vui lòng kiểm tra lại thông tin.");
      throw error;
    }
  },

  register: async (
    e: React.FormEvent<HTMLFormElement>,
    registerForm: RegisterFormType,
    notify: (
      type: NotificationContextType,
      message: string,
      description?: string
    ) => void,
    setauthOption: React.Dispatch<SetStateAction<"Login" | "Register">>
  ) => {
    e.preventDefault();

    try {
      const { name, email, phone, password, confirmPassword } = registerForm;

      if (password !== confirmPassword) {
        notify(
          "error",
          "Mật khẩu không khớp",
          "Vui lòng kiểm tra lại mật khẩu của bạn."
        );
        return;
      }

      const registerData: RegisterDataType = {
        name,
        email,
        phone,
        password,
      };

      await authService.register(registerData);

      setauthOption("Login");
      notify(
        "success",
        "Đăng ký thành công",
        "Bạn có thể đăng nhập ngay bây giờ."
      );
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage = error.response.data?.message || "Đã xảy ra lỗi";
        notify("error", "Đăng ký thất bại", errorMessage);
      } else {
        notify("error", "Đăng ký thất bại", "Vui lòng thử lại sau.");
      }
      throw error;
    }
  },
};
