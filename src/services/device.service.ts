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

  getFreeAndActive: async () => {
    const response = await axiosInstance.get("/device/free-and-active");
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

  listAllDevices: async () => {
    const response = await axiosInstance.get("/device/list-devices");
    return response.data;
  },
};

export const useListAllDevices = () => {
  return useQuery({
    queryKey: ["list-all-devices"],
    queryFn: deviceService.listAllDevices,
    enabled: true,
  });
};

export const useGetDeviceService = (filter: filterType) => {
  return useQuery({
    queryKey: ["get-list-device", filter],
    queryFn: () => deviceService.getDevices(filter),
    enabled: true,
  });
};

export const useGetFreeAndActive = () => {
  return useQuery({
    queryKey: ["get-free-and-active"],
    queryFn: deviceService.getFreeAndActive,
    enabled: true,
  });
};

export const getListDeviceService = async () => {
  const res = await axiosInstance.get("device/location");
  return res.data;
};

export const useGetListDeviceLocation = () => {
  return useQuery({
    queryKey: ["get-list-device-location"],
    queryFn: getListDeviceService,
    enabled: true,
  });
};
