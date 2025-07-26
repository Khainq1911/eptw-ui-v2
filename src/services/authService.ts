import type { LoginFormType, RegisterDataType } from "@/common/type";
import { axiosInstance } from "@/configs/axios";

export const loginService = async (loginData: LoginFormType) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const registerService = async (registerData: RegisterDataType) => {
  const response = await axiosInstance.post("/auth/register", registerData);
  return response.data;
};
