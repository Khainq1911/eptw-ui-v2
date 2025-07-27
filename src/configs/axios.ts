import { getGlobalNotify } from "@/helpers/notification-helpers";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const notify = getGlobalNotify();

    if (notify) {
      if (error.status === 400) {
        notify(
          "warning",
          "Yêu cầu không hợp lệ",
          "Dữ liệu gửi lên không đúng định dạng."
        );
      } else if (error.status === 401) {
        notify("error", "Chưa đăng nhập", "Vui lòng đăng nhập để tiếp tục.");
      } else if (error.status === 403) {
        notify(
          "error",
          "Không có quyền truy cập",
          "Bạn không được phép thực hiện thao tác này."
        );
      } else if (error.status === 500) {
        notify(
          "error",
          "Lỗi hệ thống",
          "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau."
        );
      } else {
        notify(
          "error",
          "Lỗi không xác định",
          "Có lỗi xảy ra. Vui lòng thử lại."
        );
      }
    }

    return Promise.reject(error);
  }
);
