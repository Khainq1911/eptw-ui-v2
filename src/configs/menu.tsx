import type { MenuType } from "@/common/types/sidebar.type";
import {
  PieChartOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const menuItems: MenuType[] = [
  {
    name: "Dashboard",
    icon: <PieChartOutlined />,
    path: "/dashboard",
    roleId: 1,
    isActive: false,
  },
  {
    name: "Device",
    icon: <VideoCameraOutlined />,
    path: "/device",
    roleId: 1,
    isActive: false,
  },
  {
    name: "Permit",
    icon: <FileTextOutlined />,
    path: "/permit",
    roleId: 1,
    isActive: false,
  },
  {
    name: "Template",
    icon: <SettingOutlined />,
    path: "/template",
    roleId: 1,
    isActive: false,
  },
];
