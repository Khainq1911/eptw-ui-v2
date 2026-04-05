import { AuthCommonService } from "@/common/authentication";
import {
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, Button, Dropdown, type MenuProps } from "antd";

export default function Header() {
  const { message } = App.useApp();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Đổi mật khẩu",
      icon: <SettingOutlined />,
      onClick: () => {
        message.info("Tính năng đổi mật khẩu đang phát triển");
      },
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.reload();
      },
    },
  ];
  return (
    <div className="h-[60px] flex justify-between items-center shadow-sm px-6 bg-white w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <p className="hidden md:block text-gray-800 font-semibold text-sm md:text-base truncate">
            Welcome {AuthCommonService.getUser()?.name} to EPTW website!
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Button
            icon={<BellOutlined />}
            shape="circle"
            onClick={() => message.info("Tính năng thông báo đang phát triển")}
          />
          <Dropdown menu={{ items }} trigger={["click"]}>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 px-2 rounded-lg transition-colors">
              <Button shape="circle" icon={<UserOutlined />} />
              <span className="hidden sm:inline font-medium text-gray-700">
                {AuthCommonService.getUser()?.name}
              </span>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
