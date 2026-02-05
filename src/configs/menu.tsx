import type { MenuType } from "@/common/types/sidebar.type";
import {
  PieChartOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { ROLE_NAME } from "@/common/constant";

export const menuItems: MenuType[] = [
  {
    name: "Bảng điều khiển",
    icon: <PieChartOutlined />,
    path: "/dashboard",
    roles: [ROLE_NAME.ADMIN],
    isActive: false,
  },
  {
    name: "Thiết bị",
    icon: <VideoCameraOutlined />,
    path: "/device",
    roles: [ROLE_NAME.ADMIN],
    isActive: false,
  },
  {
    name: "Giấy phép",
    icon: <FileTextOutlined />,
    path: "/permit",
    roles: [ROLE_NAME.ADMIN],
    isActive: false,
  },
  {
    name: "Mẫu biểu",
    icon: <SettingOutlined />,
    path: "/template",
    roles: [ROLE_NAME.ADMIN],
    isActive: false,
  },
  {
    name: "Định vị",
    icon: <PictureOutlined />,
    path: "/map",
    roles: [ROLE_NAME.ADMIN],
    isActive: false,
  },
  {
    name: "Quản lý người dùng",
    icon: <UserOutlined />,
    path: "/users",
    roles: [ROLE_NAME.ADMIN],
    isActive: false,
  },
  {
    name: "Loại mẫu biểu",
    icon: <AppstoreOutlined />,
    path: "/template-types",
    roles: [ROLE_NAME.ADMIN],
    isActive: false,
  },
];
