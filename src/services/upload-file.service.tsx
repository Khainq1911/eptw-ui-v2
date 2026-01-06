import { axiosInstance } from "@/configs/axios";

export const uploadFiles = async (attachments: any) => {
  const formData = new FormData();

  attachments.forEach((item: any) => {
    console.log("item", item);
    if (item.originFileObj) {
      formData.append("files", item.originFileObj);
    }
  });

  const res = await axiosInstance.post("/upload/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const uploadUpdatedFiles = async (attachments: any) => {
  const formData = new FormData();
  const oldFiles = attachments.filter(
    (item: any) => item.url && !item.originFileObj
  );

  attachments.forEach((item: any) => {
    if (item.originFileObj) {
      console.log("item.originFileObj", item.originFileObj);
      formData.append("files", item.originFileObj);
    }
  });

  const res = await axiosInstance.post("/upload/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return [...oldFiles, ...res.data];
};

export const downloadUploadedFile = async (bucketName: any, fileKey: any) => {
  console.log("bucketName, filekey", bucketName, fileKey);
  const res = await axiosInstance.post(`/upload/download-url`, {
    bucketName,
    fileKey,
  });

  return res.data;
};

export const downloadFileService = async (page: string) => {
  const res = await axiosInstance.get(`/${page}/export`, {
    responseType: "blob",
  });
  return res;
};

