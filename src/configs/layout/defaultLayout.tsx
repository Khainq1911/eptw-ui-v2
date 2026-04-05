import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(() => 
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [showMobileSidebar, setShowMobileSidebar] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setShowMobileSidebar((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isMobile
            ? showMobileSidebar
              ? "translate-x-0 w-[250px]"
              : "-translate-x-full w-[250px]"
            : collapsed
            ? "w-[80px]"
            : "w-[250px]"
        }`}
      >
        <Sidebar collapsed={!isMobile && collapsed} onToggle={handleToggleSidebar} />
      </aside>

      {/* Overlay for mobile */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isMobile ? "ml-0" : collapsed ? "ml-[80px]" : "ml-[250px]"
        }`}
      >
        <div className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
          isMobile ? "left-0" : collapsed ? "left-[80px]" : "left-[250px]"
        }`}>
           <Header />
           {/* Mobile menu toggle button in header if needed, but we can also use a FAB */}
           {isMobile && (
             <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Button 
                  icon={<MenuUnfoldOutlined />} 
                  onClick={() => setShowMobileSidebar(true)}
                  type="text"
                  className="text-xl"
                />
             </div>
           )}
        </div>

        <main className="p-5 pt-[80px] min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
