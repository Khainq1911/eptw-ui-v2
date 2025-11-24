import { axiosInstance } from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

export const createPermit = async (payload: any) => {
  const res = await axiosInstance.post("permit", payload);
  return res.data;
};

export const listPermits = async (filter: any) => {
  const res = await axiosInstance.post("permit/list", filter);
  return res.data;
};

export const deletePermit = async (id: number) => {
  const res = await axiosInstance.post(`permit/delete/${id}`);
  return res.data;
};

export const getDetailPermit = async (id: number) => {
  const res = await axiosInstance.get(`permit/${id}`);
  return res.data;
};

export const useGetDetailPermit = () => {
  return useMutation({
    mutationFn: getDetailPermit,
  });
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

export const useDeletePermit = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: deletePermit,
    onSuccess: () => {
      message.success("Xóa giấy phép thành công");
      queryClient.invalidateQueries({ queryKey: ["list-permits"] });
    },
    onError: () => {
      message.error("Xóa giấy phép thất bại");
    },
  });
};
