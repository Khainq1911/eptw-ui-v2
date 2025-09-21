import type { DeviceFormType, filterType } from "@/common/types/device.type";
import { axiosInstance } from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";

export const deviceService = {
  getDevices: async (filter: filterType) => {
    const response = await axiosInstance.post("/device/list", filter);
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


export const useGetDeviceService = (filter: filterType) => {
  return useQuery({
    queryKey: ["get-list-device", filter],
    queryFn: () => deviceService.getDevices(filter), 
    enabled: true,
  });
};
