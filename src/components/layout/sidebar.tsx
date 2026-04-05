import type { MenuType } from "@/common/types/sidebar.type";
import { menuItems } from "@/configs/menu";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../logo";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [menu, setMenu] = React.useState<MenuType[]>(menuItems);

  const navigate = useNavigate();
  const location = useLocation();

  const handleShowMenu = (path: string) => {
    menu.forEach((item) => {
      item.isActive = item.path === path;
    });
    setMenu([...menu]);
  };

  useEffect(() => {
    handleShowMenu(location.pathname);
  }, [location.pathname]);

  return (
    <div className={`bg-white h-screen transition-all duration-300 relative ${collapsed ? "w-[80px]" : "w-[250px]"}`}>
      <div className={`flex ${collapsed ? "flex-col pt-2" : "h-[60px] px-4 flex-row justify-between"} items-center border-r border-gray-100 overflow-hidden transition-all duration-300`}>
        {!collapsed ? (
          <>
            <div className="flex items-center gap-3">
              <Logo />
            </div>
            <Button 
              type="text" 
              icon={<MenuFoldOutlined />} 
              onClick={onToggle}
              className="md:flex hidden"
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="scale-75 origin-center">
              <Logo />
            </div>
            <Button 
              type="text" 
              icon={<MenuUnfoldOutlined />} 
              onClick={onToggle}
              className="md:flex hidden text-xl hover:bg-gray-50 flex items-center justify-center p-0 h-8 w-8"
            />
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2 px-4">
        {menu.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.name : ""}
            className={`cursor-pointer flex items-center transition-all duration-150 ${
              collapsed 
                ? "justify-center rounded-full w-12 h-12 mx-auto" 
                : "gap-4 px-4 rounded-2xl py-2.5"
            } ${
              item.isActive
                ? "bg-[#E6F4FE] text-[#1D4ED8]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span
              className={`text-xl flex items-center justify-center ${
                item.isActive ? "text-[#1D4ED8]" : "text-gray-500"
              }`}
            >
              {item.icon}
            </span>
            {!collapsed && (
              <p
                className={`font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                  item.isActive ? "text-[#1D4ED8]" : "text-gray-700"
                }`}
              >
                {item.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
