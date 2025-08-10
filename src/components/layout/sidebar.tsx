import type { MenuType } from "@/common/types/sidebar.type";
import { menuItems } from "@/configs/menu";
import { routesConfig } from "@/configs/routes";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";

export default function Sidebar() {
  const [menu, setMenu] = React.useState<MenuType[]>(menuItems);

  const navigate = useNavigate();
  const location = useLocation();

  const handleShowMenu = (path: string) => {
    menu.forEach((item) => {
      if (item.path.includes(path)) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });
    setMenu([...menu]);
  };

  useEffect(() => {
    handleShowMenu(location.pathname);
  }, [location.pathname]);

  return (
    <div className="bg-white w-full h-screen">
      <div className="h-[60px] shadow-sm flex items-center pl-2 border-gray-200 gap-2">
        <Link
          to={routesConfig.DashboardRoute}
          className="flex items-center space-x-2"
        >
          <img src={logo} alt="App Logo" className="w-10 h-10 rounded" />
        </Link>
        <h1 className="text-lg font-bold">Permit To Work</h1>
      </div>
      <div className="mt-2 space-y-2">
        {menu.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`cursor-pointer flex items-center gap-4 rounded-2xl transition-colors duration-150 hover:bg-gray-100 px-4 py-2 mx-1 ${
              item.isActive ? "bg-[#E6F4FE] text-[#5599FA]" : ""
            }`}
          >
            {item.icon}
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
