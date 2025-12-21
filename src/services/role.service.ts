import { axiosInstance } from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";

export const getListRoles = async () => {
  const res = await axiosInstance.get("role");
  return res.data;
};

export const useGetListRoles = () => {
  return useQuery({
    queryKey: ["get-list-roles"],
    queryFn: getListRoles,
  });
};
