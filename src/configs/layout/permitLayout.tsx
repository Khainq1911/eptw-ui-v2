import { AuthCommonService } from "@/common/authentication";
import { routesConfig } from "@/configs/routes";
import { Navigate } from "react-router-dom";
import { Button } from "antd";

export default function PermitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAthenticated: boolean = AuthCommonService.isAuthenticated();

  if (isAthenticated) {
    return (
      <div>
        <header className="fixed top-0 w-full h-[60px] flex justify-between items-center shadow-sm p-5 ">
          <div className="flex items-center justify-between w-full">
            <div className="hidden md:block"></div>
            <p className="hidden md:block ml-4 text-gray-800 font-semibold text-sm md:text-base truncate">
              Welcome {AuthCommonService.getUser()?.name} to EPTW website!
            </p>

            <Button
              type="primary"
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </div>
        </header>
        <div className="mt-[60px]">{children}</div>
      </div>
    );
  }

  return <Navigate to={routesConfig.AuthRoute} />;
}
