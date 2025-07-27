import { AuthCommonService } from "@/common/authentication";
import { routesConfig } from "@/configs/routes";
import { Navigate } from "react-router-dom";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAthenticated: boolean = AuthCommonService.isAuthenticated();

  if (isAthenticated) {
    return children;
  }

  return <Navigate to={routesConfig.AuthRoute} />;
}
