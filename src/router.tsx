import { routesConfig } from "./configs/routes";
import AuthPage from "./pages/auth-page/auth-page";
import HomePage from "./pages/home-page/home";

type Route = {
  path: string;
  component: React.FC;
  layout?: React.FC;
  roleId?: number;
};

const privateRoutes: Route[] = [
  { path: routesConfig.HomeRoute, component: HomePage },
];
const protectedRoutes: Route[] = [];
const publicRoutes: Route[] = [
  { path: routesConfig.AuthRoute, component: AuthPage },
];

export { publicRoutes, privateRoutes, protectedRoutes };
