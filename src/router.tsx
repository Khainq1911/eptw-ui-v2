import { AuthRoute } from "./configs/routes";
import AuthPage from "./pages/auth-page/auth-page";

type Route = {
  path: string;
  component: React.FC;
  layout?: React.FC;
  roleId?: number;
};

const privateRoutes: Route[] = [{ path: AuthRoute, component: AuthPage }];
const protectedRoutes: Route[] = [];
const publicRoutes: Route[] = [];

export { publicRoutes, privateRoutes, protectedRoutes };
