import { axiosInstance } from "@/configs/axios";

export const listUsers = async () => {
  const res = await axiosInstance.get("user");
  return res.data;
};
