import { axiosInstance } from "@/configs/axios";

export const getListApprovalTypes = async () => {
  const res = await axiosInstance.get("approval-type");
  return res.data;
};
