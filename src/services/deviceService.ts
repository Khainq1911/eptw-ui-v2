import type { DeviceFormType } from "@/common/types/device.type";
import { axiosInstance } from "@/configs/axios";

export const deviceService = {
  getDevices: async () => {
    const response = await axiosInstance.get("/device/list");
    return response.data;
  },

  createDevice: async (deviceData: DeviceFormType) => {
    const response = await axiosInstance.post("/device/create", deviceData);
    return response.data;
  },

  getDeviceById: async (id: string) => {
    const response = await axiosInstance.get(`/device/${id}`);
    return response.data;
  },

  updateDevice: async (id: string, updateData: DeviceFormType) => {
    const response = await axiosInstance.post(
      `/device/update/${id}`,
      updateData
    );
    return response.data;
  },

  deleteDevice: async (id: string) => {
    const response = await axiosInstance.patch(`/device/delete/${id}`);
    return response.data;
  },
};
