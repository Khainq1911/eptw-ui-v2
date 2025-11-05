import { axiosInstance } from "@/configs/axios";

export const getListRoles = async () => {
  const res = await axiosInstance.get("role");
  return res.data;
};
