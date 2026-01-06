import type { MessageInstance } from "antd/es/message/interface";
import { downloadFileService } from "@/services/upload-file.service";

export const downloadFile = async (
  page: string,
  message: MessageInstance
) => {
  try {
    message.open({
      type: "loading",
      content: "Đang tải file...",
      key: "download",
    });

    const res = await downloadFileService(page);

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${page}.xlsx`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.open({
      type: "success",
      content: "Tải file thành công",
      key: "download",
    });
  } catch (error) {
    message.open({
      type: "error",
      content: "Tải file thất bại",
      key: "download",
    });
  }
};
