import { axiosInstance } from "@/configs/axios";
import type { Template } from "@/pages/template-page/template-type";

export const createTemplate = async (data: Template) => {
  const res = await axiosInstance.post("template", data);
  return res.data;
};
