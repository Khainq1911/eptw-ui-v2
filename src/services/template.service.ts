import { axiosInstance } from "@/configs/axios";
import type { Template } from "@/pages/template-page/template-type";

export const createTemplate = async (data: Template) => {
  const res = await axiosInstance.post("template", data);
  return res.data;
};

export const listTemplate = async (filter: {
  limit: number;
  page: number;
  status?: string;
  templateTypeId?: number;
  search?: string;
}) => {
  const res = await axiosInstance.post("template/list", filter);
  return res.data;
};

export const deleteTemplate = async (id: number) => {
  const res = await axiosInstance.patch(`template/delete/${id}`);
  return res.data;
};

export const getTemplateById = async (id: number) => {
  const res = await axiosInstance.get(`template/${id}`);
  return res.data;
};

export const updateTemplate = async (id: number, body: Template) => {
  const res = await axiosInstance.put(`template/${id}`, body);
  return res.data;
};
