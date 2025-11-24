import { Navigate } from "react-router-dom";
import { routesConfig } from "./configs/routes";
import AuthPage from "./pages/auth-page/auth-page";
import DashboardPage from "./pages/dashboard-page/dashboard-page";
import DevicePage from "./pages/device-page/device-page";
import PermitPage from "./pages/permit-page";
import TemplatePage from "./pages/template-page/template-page";
import DetailPermit from "./pages/detail-permit-page.tsx";

type Route = {
  path: string;
  component: React.FC;
  layout?: React.FC;
  roleId?: number;
};

const privateRoutes: Route[] = [
  { path: routesConfig.DashboardRoute, component: DashboardPage },
  { path: routesConfig.DeviceRoute, component: DevicePage },
  { path: routesConfig.TemplateRoute, component: TemplatePage },
  { path: routesConfig.PermitRoute, component: PermitPage },

  {
    path: "/",
    component: () => <Navigate to={routesConfig.DashboardRoute} replace />,
  },
];
const protectedRoutes: Route[] = [];

const publicRoutes: Route[] = [
  { path: routesConfig.AuthRoute, component: AuthPage },
];

const permitRoutes: Route[] = [
  { path: routesConfig.DetailPermitRoute, component: DetailPermit },
];

export { publicRoutes, privateRoutes, protectedRoutes, permitRoutes };
