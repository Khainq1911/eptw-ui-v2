import type { MenuType } from "@/common/types/sidebar.type";
import {
  PieChartOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

export const menuItems: MenuType[] = [
  {
    name: "Bảng điều khiển",
    icon: <PieChartOutlined />,
    path: "/dashboard",
    roleId: 1,
    isActive: false,
  },
  {
    name: "Thiết bị",
    icon: <VideoCameraOutlined />,
    path: "/device",
    roleId: 1,
    isActive: false,
  },
  {
    name: "Giấy phép",
    icon: <FileTextOutlined />,
    path: "/permit",
    roleId: 1,
    isActive: false,
  },
  {
    name: "Mẫu biểu",
    icon: <SettingOutlined />,
    path: "/template",
    roleId: 1,
    isActive: false,
  },
  {
    name: "Quản lý người dùng",
    icon: <UserOutlined />,
    path: "/users",
    roleId: 1,
    isActive: false,
  },
  {
    name: "Loại mẫu biểu",
    icon: <AppstoreOutlined />,
    path: "/template-types",
    roleId: 1,
    isActive: false,
  },
];
