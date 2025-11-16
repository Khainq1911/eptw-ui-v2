import { axiosInstance } from "@/configs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const createPermit = async (payload: any) => {
  const res = await axiosInstance.post("permit", payload);
  return res.data;
};

export const listPermits = async (filter: any) => {
  const res = await axiosInstance.post("permit/list", filter);
  return res.data;
};

export const useCreatePermit = () => {
  return useMutation({
    mutationFn: createPermit,
  });
};

export const useListPermits = (filter: any) => {
  return useQuery({
    queryKey: ["list-permits", filter],
    queryFn: () => listPermits(filter),
  });
};
