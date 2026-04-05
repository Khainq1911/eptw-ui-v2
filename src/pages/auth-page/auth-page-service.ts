import type { NavigateFunction } from "react-router-dom";
import type {
  LoginFormType,
} from "@/common/types/auth.type";
import type { NotificationInstance } from "antd/es/notification/interface";
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

  forgotPassword: async (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    notification: NotificationInstance
  ) => {
    e.preventDefault();

    try {
      if (!email) {
        notification.error({
          message: "Lỗi",
          description: "Vui lòng nhập email.",
          ...notifOptions,
        });
        return;
      }

      await authService.forgotPassword(email);

      notification.success({
        message: "Yêu cầu đã được gửi",
        description: "Vui lòng kiểm tra hộp thư email của bạn để tiếp tục khôi phục mật khẩu.",
        ...notifOptions,
      });

    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage = error.response.data?.message || "Đã xảy ra lỗi";
        notification.error({
          message: "Lỗi",
          description: errorMessage,
          ...notifOptions,
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: "Vui lòng thử lại sau.",
          ...notifOptions,
        });
      }
      throw error;
    }
  },

  resetPassword: async (
    e: React.FormEvent<HTMLFormElement>,
    resetForm: any,
    navigate: NavigateFunction,
    notification: NotificationInstance
  ) => {
    e.preventDefault();

    try {
      const { token, password, confirmPassword } = resetForm;
      
      if (!token) {
        notification.error({
          message: "Lỗi",
          description: "Thiếu mã xác thực (Token).",
          ...notifOptions,
        });
        return;
      }

      if (password !== confirmPassword) {
        notification.error({
          message: "Lỗi",
          description: "Mật khẩu không khớp.",
          ...notifOptions,
        });
        return;
      }

      await authService.resetPassword({ token, password });

      notification.success({
        message: "Thành công",
        description: "Đã đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
        ...notifOptions,
      });

      navigate(routesConfig.AuthRoute);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage = error.response.data?.message || "Đã xảy ra lỗi";
        notification.error({
          message: "Lỗi",
          description: errorMessage,
          ...notifOptions,
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: "Vui lòng thử lại sau.",
          ...notifOptions,
        });
      }
      throw error;
    }
  },
};
