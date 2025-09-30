import type { MenuType } from "@/common/types/sidebar.type";
import { menuItems } from "@/configs/menu";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../logo";

export default function Sidebar() {
  const [menu, setMenu] = React.useState<MenuType[]>(menuItems);

  const navigate = useNavigate();
  const location = useLocation();

  const handleShowMenu = (path: string) => {
    menu.forEach((item) => {
      item.isActive = item.path.includes(path);
    });
    setMenu([...menu]);
  };

  useEffect(() => {
    handleShowMenu(location.pathname);
  }, [location.pathname]);

  return (
    <div className="bg-white w-full h-screen">
      <div className="h-[60px] flex items-center pl-2 gap-2">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Logo />
            <div className="text-xl font-bold text-gray-800">
              Permit To Work
            </div>
          </div>
        </div>
      </div>

      {/* Thêm chữ Menu ở đây */}
      <div className="px-4 mt-4 text-gray-500 font-semibold uppercase tracking-wide">
        Menu
      </div>

      <div className="mt-2 space-y-2">
        {menu.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`cursor-pointer flex items-center gap-4 rounded-lg transition-colors duration-150 hover:bg-gray-100 px-4 py-2 mx-2 ${
              item.isActive ? "bg-[#E6F4FE] text-[#1D4ED8]" : "text-gray-700"
            }`}
          >
            <span
              className={`text-lg ${
                item.isActive
                  ? "text-[#1D4ED8]"
                  : "text-gray-500 group-hover:text-gray-700"
              }`}
            >
              {item.icon}
            </span>
            <p
              className={`font-medium ${
                item.isActive
                  ? "text-[#1D4ED8]"
                  : "text-gray-700 group-hover:text-gray-900"
              }`}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
