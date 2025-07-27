import { AuthCommonService } from "@/common/authentication";
import { routesConfig } from "@/configs/routes";
import { Navigate } from "react-router-dom";

export default function ProtectedLayout({
  children,
  roleId,
}: {
  children: React.ReactNode;
  roleId: number | undefined;
}) {
  const isAuth = AuthCommonService.isAuthenticated();
  const userId = AuthCommonService.getRoleId();
  const routeId = roleId;

  if (!isAuth) return <Navigate to={routesConfig.AuthRoute} />;

  if (userId !== routeId) return <Navigate to={routesConfig.HomeRoute} />;

  return children;
}
