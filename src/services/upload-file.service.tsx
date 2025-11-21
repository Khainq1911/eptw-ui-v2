import { axiosInstance } from "@/configs/axios";

export const uploadFiles = async (attachments: any) => {
  const formData = new FormData();

  attachments.forEach((item: any) => {
    if (item.file[0].originFileObj) {
      formData.append("files", item.file[0].originFileObj);
    }
  });

  const res = await axiosInstance.post("/upload/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
