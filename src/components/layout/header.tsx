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
    <div className="fixed top-0 w-full h-[60px] flex justify-between items-center shadow-sm p-5 ">
      <div className="flex items-center justify-between w-full md:w-[calc(100%-250px)] ">
        <div className="hidden md:block"></div>
        <p className="hidden md:block ml-4 text-gray-800 font-semibold text-sm md:text-base truncate">
          Welcome {AuthCommonService.getUser()?.name} to EPTW website!
        </p>

        <div className="flex gap-2 items-center">
          <Button
            icon={<BellOutlined />}
            shape="circle"
            onClick={() => message.info("Tính năng thông báo đang phát triển")}
          />
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button shape="circle" icon={<UserOutlined />}></Button>
          </Dropdown>
          <p>{AuthCommonService.getUser()?.name}</p>
        </div>
      </div>
    </div>
  );
}
