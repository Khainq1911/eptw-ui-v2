import { AuthCommonService } from "@/common/authentication";
import Sidebar from "@/components/layout/sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSidebar, setOpenSidebar] = React.useState<boolean>(false);

  const handleToggleSidebar = () => setOpenSidebar((prev) => !prev);

  return (
    <div>
      <aside
        className={`fixed left-0 top-0 w-[250px]  text-gray-800 border-r-1 border-gray-200 ${
          openSidebar ? "block" : "hidden"
        } md:block h-screen z-100 bg-red-50`}
      >
        <Sidebar />
      </aside>
      <div
        className={`fixed inset-0 bg-black/50 z-50 ${
          openSidebar ? "block" : "hidden"
        }`}
      ></div>
      <div className="relative ml-0 md:ml-[250px]">
        <header className="fixed top-0 w-full h-[60px] flex justify-between items-center shadow-sm p-5 ">
          <div className="flex items-center justify-between w-full md:w-[calc(100%-250px)]">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black font-bold text-white">
                E
              </div>

              <span className="text-xl font-bold text-gray-800">EPTW</span>
            </Link>

            <p className="hidden md:block ml-4 text-gray-800 font-semibold text-sm md:text-base truncate">
              Welcome {AuthCommonService.getUser()?.name} to EPTW website!
            </p>

            <Button type="primary">Logout</Button>
          </div>
        </header>
        <main className="p-5 mt-[60px] h-[calc(100vh-60px)]">
          <div
            className={`absolute bottom-8 left-0 block md:hidden z-50 ${
              openSidebar ? "ml-[250px]" : "ml-0"
            }`}
          >
            <Button onClick={handleToggleSidebar}>
              {openSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </Button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
