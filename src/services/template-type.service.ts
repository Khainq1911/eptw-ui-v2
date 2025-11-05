import { axiosInstance } from "@/configs/axios";

export const getListTemplateTypes = async () => {
  const res = await axiosInstance.get("template-type");
  return res.data;
};
