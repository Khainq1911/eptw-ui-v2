import { getListApprovalTypes } from "@/services/approval-type.service";
import { getListRoles } from "@/services/role.service";
import { getListTemplateTypes } from "@/services/template-type.service";
import { createTemplate, listTemplate } from "@/services/template.service";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useListTemplates = (filter: any) => {
  return useQuery({
    queryKey: ["list-template", filter],
    queryFn: () => listTemplate(filter),
  });
};
