import { axiosInstance } from "@/configs/axios";

export const deviceService = {
    getDevices: async () => {
        const response = await axiosInstance.get("/device/list");
        return response.data;
    },

    updateDevice: async (id: string, updateData: any) => {
        const response = await axiosInstance.put(`/device/${id}`, updateData);
        return response.data;
    }
};