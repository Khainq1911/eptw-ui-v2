import type { LoginFormType } from "../common/type";
import { axiosInstance } from "../configs/axios";

export const loginService = async (loginData: LoginFormType) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
