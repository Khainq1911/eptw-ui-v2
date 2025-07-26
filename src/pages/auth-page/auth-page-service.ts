import type { NavigateFunction } from "react-router-dom";
import type {
  LoginFormType,
  NotificationContextType,
  RegisterDataType,
  RegisterFormType,
} from "@/common/type";
import { loginService, registerService } from "@/services/authService";
import type { SetStateAction } from "react";

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

export const register = async (
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

    await registerService(registerData);
    
    setauthOption("Login");
    notify(
      "success",
      "Đăng ký thành công",
      "Bạn có thể đăng nhập ngay bây giờ."
    );

  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
