import { AuthCommonService } from "@/common/authentication";
import { routesConfig } from "@/configs/routes";
import { Navigate } from "react-router-dom";
import DefaultLayout from "./defaultLayout";
import ErrorPage from "@/pages/error-page";

export default function ProtectedLayout({
  children,
  roleId,
}: {
  children: React.ReactNode;
  roleId: number[] | undefined;
}) {
  const isAuth = AuthCommonService.isAuthenticated();
  const userId = AuthCommonService.getUser()?.roleId;

  if (!isAuth) return <Navigate to={routesConfig.AuthRoute} />;

  if (roleId && userId && !roleId.includes(userId))
    return (
      <div className="h-screen">
        <ErrorPage status="403" />
      </div>
    );

  return <DefaultLayout>{children}</DefaultLayout>;
}
