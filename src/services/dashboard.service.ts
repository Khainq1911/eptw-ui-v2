import { axiosInstance } from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";

export const getPermitTempateStats = async () => {
  const res = await axiosInstance.get("dashboard/permit-template");
  return res.data;
};

export const useGetPermitTemplateStats = async () => {
  return useQuery({
    queryKey: ["get-permit-template-stats"],
    queryFn: getPermitTempateStats,
  });
};
