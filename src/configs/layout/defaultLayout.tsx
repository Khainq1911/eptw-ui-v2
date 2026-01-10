import { AuthCommonService } from "@/common/authentication";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

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
        } md:block h-screen z-100`}
      >
        <Sidebar />
      </aside>
      <div
        className={`fixed inset-0 bg-black/50 z-50 ${
          openSidebar ? "block" : "hidden"
        }`}
      ></div>
      <div className="relative ml-0 md:ml-[250px]">
        <Header />
        <main className="p-5 mt-[60px] h-[calc(100vh-60px)] bg-[#F5F7FB] overflow-y-auto">
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
