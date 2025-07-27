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
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

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
      switch (error.status) {
        case 400:
          notify(
            "warning",
            "Yêu cầu không hợp lệ",
            "Dữ liệu gửi lên không đúng định dạng."
          );
          break;
        case 401:
          notify("error", "Chưa xác thực", "Vui lòng đăng nhập để tiếp tục.");
          break;
        case 403:
          notify(
            "error",
            "Truy cập bị từ chối",
            "Bạn không có quyền thực hiện thao tác này."
          );
          break;
        case 404:
          notify(
            "error",
            "Không tìm thấy tài nguyên",
            "Vui lòng kiểm tra lại URL hoặc thử lại sau."
          );
          break;
        case 405:
          notify(
            "warning",
            "Phương thức không được hỗ trợ",
            "Hành động này không được cho phép."
          );
          break;
        case 408:
          notify(
            "error",
            "Hết thời gian chờ",
            "Máy chủ mất quá nhiều thời gian để phản hồi."
          );
          break;
        case 409:
          notify(
            "warning",
            "Xung đột dữ liệu",
            "Dữ liệu bạn gửi đang bị trùng hoặc xung đột."
          );
          break;
        case 410:
          notify(
            "error",
            "Tài nguyên không còn tồn tại",
            "Thông tin này đã bị xoá hoặc không còn hợp lệ."
          );
          break;
        case 422:
          notify(
            "warning",
            "Dữ liệu không hợp lệ",
            "Vui lòng kiểm tra lại các trường thông tin."
          );
          break;
        case 429:
          notify(
            "warning",
            "Quá nhiều yêu cầu",
            "Bạn đang thao tác quá nhanh. Vui lòng thử lại sau."
          );
          break;
        case 500:
          notify(
            "error",
            "Lỗi máy chủ",
            "Đã xảy ra lỗi nội bộ. Vui lòng thử lại sau."
          );
          break;
        case 501:
          notify(
            "error",
            "Chức năng chưa được hỗ trợ",
            "Máy chủ không hỗ trợ chức năng này."
          );
          break;
        case 502:
          notify(
            "error",
            "Bad Gateway",
            "Có sự cố khi nhận phản hồi từ máy chủ trung gian."
          );
          break;
        case 503:
          notify(
            "error",
            "Dịch vụ không sẵn sàng",
            "Hệ thống đang bảo trì hoặc quá tải."
          );
          break;
        case 504:
          notify(
            "error",
            "Gateway Timeout",
            "Không nhận được phản hồi từ máy chủ. Vui lòng thử lại."
          );
          break;
        default:
          notify(
            "error",
            `Lỗi không xác định (${error.status})`,
            "Đã xảy ra lỗi không xác định. Vui lòng thử lại."
          );
      }
    }

    return Promise.reject(error);
  }
);
