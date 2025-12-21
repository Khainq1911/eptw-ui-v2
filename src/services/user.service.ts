import { axiosInstance } from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

export const listUsers = async () => {
  const res = await axiosInstance.get("user");
  return res.data;
};

export const getUsers = async (filter: any) => {
  const res = await axiosInstance.post(`user/filter`, filter);
  return res.data;
};

export const useGetUsers = (filter: any) => {
  return useQuery({
    queryKey: ["get-users", filter],
    queryFn: () => getUsers(filter),
  });
};

export const createUserService = async (data: any) => {
  const res = await axiosInstance.post("user/create", data);
  return res.data;
};

export const useCreateUserService = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: async (data: any) => {
      return await createUserService(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-users"],
        exact: false,
      });
      notification.success({
        message: "Tạo mới người dùng thành công",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Tạo mới người dùng thất bại",
        description:
          (error as any)?.response?.data?.message ||
          "Đã có lỗi xảy ra, vui lòng thử lại",
      });
    },
  });
};

export const findUserById = async (id: string) => {
  const res = await axiosInstance.get(`user/find/${id}`);
  return res.data;
};

export const useFindUserById = () => {
  return useMutation({
    mutationFn: findUserById,
  });
};

export const updateUserService = async (id: number, data: any) => {
  const res = await axiosInstance.put(`user/update/${id}`, data);
  return res.data;
};

export const useUpdateUserService = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  return useMutation({
    mutationKey: ["update-user"],
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await updateUserService(id, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-users"],
        exact: false,
      });
      notification.success({
        message: "Cập nhật người dùng thành công",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Cập nhật người dùng thất bại",
        description:
          (error as any)?.response?.data?.message ||
          "Đã có lỗi xảy ra, vui lòng thử lại",
      });
    },
  });
};
