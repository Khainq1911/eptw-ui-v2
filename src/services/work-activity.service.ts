import { axiosInstance } from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";

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
