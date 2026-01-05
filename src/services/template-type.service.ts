import { axiosInstance } from "@/configs/axios";
import type {
  CreateTemplateTypeDto,
  TemplateType,
  UpdateTemplateTypeDto,
} from "@/pages/template-type-page/index.dto";

export const getListTemplateTypes = async () => {
  const res = await axiosInstance.get("template-types");
  return res.data;
};

export const getTemplateTypes = async (): Promise<TemplateType[]> => {
  const res = await axiosInstance.get("/template-types/all");
  return res.data;
};

export const getTemplateTypesWithFilter = async (filter: any) => {
  const res = await axiosInstance.post(`template-types/filter`, filter);
  return res.data;
};

export const createTemplateType = async (
  data: CreateTemplateTypeDto
): Promise<TemplateType> => {
  const res = await axiosInstance.post("/template-types", data);
  return res.data;
};

export const updateTemplateType = async (
  id: number,
  data: UpdateTemplateTypeDto
): Promise<TemplateType> => {
  const res = await axiosInstance.patch(`/template-types/${id}`, data);
  return res.data;
};

export const deleteTemplateType = async (id: number) => {
  await axiosInstance.delete(`/template-types/${id}`);
};
