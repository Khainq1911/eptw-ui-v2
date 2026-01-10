import { Navigate } from "react-router-dom";
import { routesConfig } from "./configs/routes";
import AuthPage from "./pages/auth-page/auth-page";
import DashboardPage from "./pages/dashboard-page/dashboard-page";
import DevicePage from "./pages/device-page/device-page";
import PermitPage from "./pages/permit-page";
import TemplatePage from "./pages/template-page/template-page";
import ViewPermit from "./pages/view-permit-page.tsx";
import UpdatePermit from "./pages/update-permit-page.tsx/index.tsx";
import UserPage from "./pages/user-page/index.tsx";
import TemplateTypePage from "./pages/template-type-page/index.tsx";
import { ROLE_ID } from "./common/constant.ts";
import MapPage from "./pages/map-page/index.tsx";

type Route = {
  path: string;
  component: React.FC;
  layout?: React.FC;
  roleId?: number[];
};

const privateRoutes: Route[] = [
  { path: routesConfig.DashboardRoute, component: DashboardPage },
  { path: routesConfig.DeviceRoute, component: DevicePage },
  { path: routesConfig.TemplateRoute, component: TemplatePage },
  { path: routesConfig.PermitRoute, component: PermitPage },
  { path: routesConfig.MapRoute, component: MapPage },
  {
    path: "/",
    component: () => <Navigate to={routesConfig.DashboardRoute} replace />,
  },
];
const protectedRoutes: Route[] = [
  {
    path: routesConfig.UserManagementRoute,
    component: UserPage,
    roleId: [ROLE_ID.ADMIN],
  },
  {
    path: routesConfig.TemplateTypeRoute,
    component: TemplateTypePage,
    roleId: [ROLE_ID.ADMIN],
  },
];

const publicRoutes: Route[] = [
  { path: routesConfig.AuthRoute, component: AuthPage },
];

const permitRoutes: Route[] = [
  { path: routesConfig.ViewPermitRoute, component: ViewPermit },
  { path: routesConfig.UpdatePermitRoute, component: UpdatePermit },
];

export { publicRoutes, privateRoutes, protectedRoutes, permitRoutes };
