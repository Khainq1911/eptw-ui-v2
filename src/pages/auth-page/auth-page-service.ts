import type { NavigateFunction } from "react-router-dom";
import type {
  LoginFormType,
  RegisterDataType,
  RegisterFormType,
} from "@/common/types/auth.type";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { SetStateAction } from "react";
import { AxiosError } from "axios";
import { routesConfig } from "@/configs/routes";
import { authService } from "@/services/auth.service";

const notifOptions = { placement: "topRight" as const, duration: 3 };

export const authHandler = {
  login: async (
    e: React.FormEvent<HTMLFormElement>,
    loginForm: LoginFormType,
    navigate: NavigateFunction,
    notification: NotificationInstance
  ) => {
    e.preventDefault();

    try {
      const res = await authService.login(loginForm);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      navigate(routesConfig.DashboardRoute);
      notification.success({
        message: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
        ...notifOptions,
      });
    } catch (error) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: "Vui lòng kiểm tra lại thông tin.",
        ...notifOptions,
      });
      throw error;
    }
  },

  register: async (
    e: React.FormEvent<HTMLFormElement>,
    registerForm: RegisterFormType,
    notification: NotificationInstance,
    setauthOption: React.Dispatch<SetStateAction<"Login" | "Register">>
  ) => {
    e.preventDefault();

    try {
      const { name, email, phone, password, confirmPassword } = registerForm;

      if (password !== confirmPassword) {
        notification.error({
          message: "Mật khẩu không khớp",
          description: "Vui lòng kiểm tra lại mật khẩu của bạn.",
          ...notifOptions,
        });
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
      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn có thể đăng nhập ngay bây giờ.",
        ...notifOptions,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage = error.response.data?.message || "Đã xảy ra lỗi";
        notification.error({
          message: "Đăng ký thất bại",
          description: errorMessage,
          ...notifOptions,
        });
      } else {
        notification.error({
          message: "Đăng ký thất bại",
          description: "Vui lòng thử lại sau.",
          ...notifOptions,
        });
      }
      throw error;
    }
  },
};
