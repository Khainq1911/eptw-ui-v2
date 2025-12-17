import { axiosInstance } from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";

export const getPermitTempateStats = async (filterDate: any) => {
  const res = await axiosInstance.post("dashboard/permit-template", filterDate);
  return res.data;
};

export const useGetPermitTemplateStats = (filterDate: any) => {
  return useQuery({
    queryKey: ["get-permit-template-stats", filterDate],
    queryFn: () => getPermitTempateStats(filterDate),
  });
};

export const getPermitStatusStats = async (filterDate: any) => {
  const res = await axiosInstance.post("dashboard/permit-status", filterDate);
  return res.data;
};

export const useGetPermitStatusStats = (filterDate: any) => {
  return useQuery({
    queryKey: ["get-permit-status-stats", filterDate],
    queryFn: () => getPermitStatusStats(filterDate),
  });
};

export const getPermitRoleStats = async (filterDate: any) => {
  const res = await axiosInstance.post("dashboard/permit-role", filterDate);
  return res.data;
};

export const useGetPermitTypeStats = (filterDate: any) => {
  return useQuery({
    queryKey: ["get-permit-type-stats", filterDate],
    queryFn: () => getPermitRoleStats(filterDate),
  });
};

export const getDeviceStatusStats = async () => {
  const res = await axiosInstance.get("dashboard/device-status");
  return res.data;
};

export const useGetDeviceStatusStats = () => {
  return useQuery({
    queryKey: ["get-device-status-stats"],
    queryFn: getDeviceStatusStats,
  });
};

export const getDeviceUsedStats = async () => {
  const res = await axiosInstance.get("dashboard/device-used");
  return res.data;
};

export const useGetDeviceUsedStats = () => {
  return useQuery({
    queryKey: ["get-device-used-stats"],
    queryFn: getDeviceUsedStats,
  });
};

export const getTemplateApprovalTypeStats = async () => {
  const res = await axiosInstance.get("dashboard/template-approval-type");
  return res.data;
};

export const useGetTemplateApprovalTypeStats = () => {
  return useQuery({
    queryKey: ["get-template-approval-type-stats"],
    queryFn: getTemplateApprovalTypeStats,
  });
};

export const getTemplateTypeStats = async () => {
  const res = await axiosInstance.get("dashboard/template-type");
  return res.data;
};

export const useGetTemplateTypeStats = () => {
  return useQuery({
    queryKey: ["get-template-type-stats"],
    queryFn: getTemplateTypeStats,
  });
};
