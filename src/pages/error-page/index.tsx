import { Result, Button, Space } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface ErrorPageProps {
  status: "404" | "500" | "403" | "503";
  title?: string;
  subTitle?: string;
  showBackButton?: boolean;
}

export default function ErrorPage({
  status = "404",
  title = "Lỗi",
  subTitle = "Có lỗi xảy ra. Vui lòng thử lại sau.",
  showBackButton = true,
}: ErrorPageProps) {
  // Map HTTP status sang ResultStatusType hợp lệ của Ant Design
  const mapStatus = (s: string) => {
    switch (s) {
      case "404":
        return "404";
      case "500":
        return "500";
      case "403":
        return "403";
      case "503":
        return "500"; // map 503 sang 500
      default:
        return "error";
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "404":
        return {
          title: "404 - Không Tìm Thấy",
          subTitle: "Trang bạn tìm kiếm không tồn tại.",
        };
      case "500":
        return {
          title: "500 - Lỗi Máy Chủ",
          subTitle: "Có lỗi xảy ra trên máy chủ. Vui lòng thử lại sau.",
        };
      case "403":
        return {
          title: "403 - Truy Cập Bị Từ Chối",
          subTitle: "Bạn không có quyền truy cập trang này.",
        };
      case "503":
        return {
          title: "503 - Dịch Vụ Không Có Sẵn",
          subTitle: "Dịch vụ hiện không khả dụng. Vui lòng thử lại sau.",
        };
      default:
        return { title, subTitle };
    }
  };

  const { title: defaultTitle, subTitle: defaultSubTitle } = getStatusMessage();

  return (
    <div className="flex items-center h-full justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Result
        status={mapStatus(status)}
        title={
          <h1 className="text-4xl font-bold text-gray-800">{defaultTitle}</h1>
        }
        subTitle={<p className="text-lg text-gray-600">{defaultSubTitle}</p>}
        extra={
          <Space>
            {showBackButton && (
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
              >
                Quay Lại
              </Button>
            )}
            <Link to="/">
              <Button type="primary" icon={<HomeOutlined />}>
                Trang Chủ
              </Button>
            </Link>
          </Space>
        }
      />
    </div>
  );
}
