import { getListApprovalTypes } from "@/services/approval-type.service";
import { getListRoles } from "@/services/role.service";
import { getListTemplateTypes } from "@/services/template-type.service";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  listTemplate,
  updateTemplate,
} from "@/services/template.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, notification } from "antd";
import React from "react";

export const TemplateService = () => {
  const [openAddTemplateModal, setOpenAddTemplateModal] =
    React.useState<boolean>(false);

  return { openAddTemplateModal, setOpenAddTemplateModal };
};

export const useGetListRoles = () => {
  return useQuery({
    queryKey: ["get-list-roles"],
    queryFn: getListRoles,
  });
};

export const useGetListTemplateTypes = () => {
  return useQuery({
    queryKey: ["get-list-template-types"],
    queryFn: getListTemplateTypes,
  });
};

export const useGetListApprovalTypes = () => {
  return useQuery({
    queryKey: ["get-list-approval-types"],
    queryFn: getListApprovalTypes,
  });
};

export const useCreateTemplateMutation = () => {
  return useMutation({
    mutationFn: (data: any) => createTemplate(data),
  });
};

export const useUpdateTemplateMutation = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-template"] });
      notification.success({ message: "Cập nhật mẫu giấy phép thành công" });
    },
    onError: () => {
      notification.error({ message: "Cập nhật mẫu giấy phép thất bại" });
    },
  });
};

export const useListTemplates = (filter: any) => {
  return useQuery({
    queryKey: ["list-template", filter],
    queryFn: () => listTemplate(filter),
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  return useMutation({
    mutationFn: (id: number) => deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-template"] });
      notification.success({ message: "Xóa mẫu giấy phép thành công" });
    },
    onError: () => {
      notification.error({ message: "Xóa mẫu giấy phép thất bại" });
    },
  });
};

export const useGetTemplateById = () => {
  return useMutation({
    mutationFn: (id: number) => getTemplateById(id),
  });
};
