import type { LoginFormType } from "../../common/type";
import { loginService } from "../../services/authService";

export const login = async (e: any, loginForm: LoginFormType) => {

  e.preventDefault();
  try {
    const res = await loginService(loginForm);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);

    window.location.href = "/home"; 
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
