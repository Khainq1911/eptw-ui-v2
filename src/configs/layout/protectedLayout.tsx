import { AuthCommonService } from "@/common/authentication";
import { routesConfig } from "@/configs/routes";
import { Navigate } from "react-router-dom";
import DefaultLayout from "./defaultLayout";
import ErrorPage from "@/pages/error-page";

export default function ProtectedLayout({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: string[] | undefined;
}) {
  const isAuth = AuthCommonService.isAuthenticated();
  const userAlias = AuthCommonService.getUser()?.alias;

  if (!isAuth) return <Navigate to={routesConfig.AuthRoute} />;

  if (roles && userAlias && !roles.includes(userAlias))
    return (
      <div className="h-screen">
        <ErrorPage status="403" />
      </div>
    );

  return <DefaultLayout>{children}</DefaultLayout>;
}
