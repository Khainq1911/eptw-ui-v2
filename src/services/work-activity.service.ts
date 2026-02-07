import type {
  CreateWorkActivityDto,
  UpdateWorkActivityDto,
  WorkActivityFilterType,
} from "@/common/types/work-activity.type";
import { axiosInstance } from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

export const workActivityService = {
  // POST /work-activity/list
  getWorkActivities: async (filter: WorkActivityFilterType) => {
    const response = await axiosInstance.post("/work-activity/list", filter);
    return response.data;
  },

  // POST /work-activity
  createWorkActivity: async (data: CreateWorkActivityDto) => {
    const response = await axiosInstance.post("/work-activity", data);
    return response.data;
  },

  // GET /work-activity/:id
  getWorkActivityById: async (id: number) => {
    const response = await axiosInstance.get(`/work-activity/${id}`);
    return response.data;
  },

  // PUT /work-activity/:id
  updateWorkActivity: async (id: number, data: UpdateWorkActivityDto) => {
    const response = await axiosInstance.put(`/work-activity/${id}`, data);
    return response.data;
  },

  // DELETE /work-activity/:id
  deleteWorkActivity: async (id: number) => {
    const response = await axiosInstance.delete(`/work-activity/${id}`);
    return response.data;
  },
};

export const getAllWorkActivity = async () => {
  const res = await axiosInstance.get("work-activity");
  return res.data;
};

export const useGetWorkActivities = () => {
  return useQuery({
    queryKey: ["get-all-work-activity"],
    queryFn: getAllWorkActivity,
  });
};

export const useGetWorkActivityList = (filter: WorkActivityFilterType) => {
  return useQuery({
    queryKey: ["get-work-activity-list", filter],
    queryFn: () => workActivityService.getWorkActivities(filter),
    enabled: true,
  });
};

// Mutation hooks with notifications
export const useCreateWorkActivity = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (data: CreateWorkActivityDto) =>
      workActivityService.createWorkActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-work-activity-list"] });
      notification.success({
        message: "Thêm hoạt động thành công",
        description: "Hoạt động đã được thêm vào hệ thống",
        placement: "topRight",
        duration: 3,
      });
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const msg = err.response?.data?.message || "Đã có lỗi xảy ra";
      notification.error({
        message: "Thêm hoạt động thất bại",
        description: msg,
        placement: "topRight",
        duration: 3,
      });
    },
  });
};

export const useUpdateWorkActivity = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWorkActivityDto }) =>
      workActivityService.updateWorkActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-work-activity-list"] });
      notification.success({
        message: "Cập nhật hoạt động thành công",
        description: "Hoạt động đã được cập nhật vào hệ thống",
        placement: "topRight",
        duration: 3,
      });
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const msg = err.response?.data?.message || "Đã có lỗi xảy ra";
      notification.error({
        message: "Cập nhật hoạt động thất bại",
        description: msg,
        placement: "topRight",
        duration: 3,
      });
    },
  });
};

export const useDeleteWorkActivity = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (id: number) => workActivityService.deleteWorkActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-work-activity-list"] });
      notification.success({
        message: "Xóa hoạt động thành công",
        description: "Hoạt động đã được xóa khỏi hệ thống",
        placement: "topRight",
        duration: 3,
      });
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const msg = err.response?.data?.message || "Đã có lỗi xảy ra";
      notification.error({
        message: "Xóa hoạt động thất bại",
        description: msg,
        placement: "topRight",
        duration: 3,
      });
    },
  });
};
