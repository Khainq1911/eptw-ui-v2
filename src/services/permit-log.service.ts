import { axiosInstance } from "@/configs/axios";
import { useMutation } from "@tanstack/react-query";

const getPermitLogs = async (permitId: number) => {
    const res = await axiosInstance.get(`/permit-log?permitId=${permitId}`);
    return res.data;
};

export const useGetPermitLogs = (permitId: number) => {
    return useMutation({
        mutationFn: () => getPermitLogs(permitId),
    });
};