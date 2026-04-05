import type { LoginFormType, RegisterDataType } from "@/common/types/auth.type";
import { axiosInstance } from "@/configs/axios";

export const authService = {
  login: async (loginData: LoginFormType) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
  },

  register: async (registerData: RegisterDataType) => {
    const response = await axiosInstance.post("/auth/register", registerData);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post("/auth/forget-password", { email });
    return response.data;
  },

  resetPassword: async (resetData: any) => {
    const response = await axiosInstance.post("/auth/reset-password", resetData);
    return response.data;
  },
};
