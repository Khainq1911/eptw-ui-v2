type Route = {
  path: string;
  component: React.FC;
  layout?: React.FC;
  roleId?: number;
};

const privateRoutes: Route[] = [];
const protectedRoutes: Route[] = [];
const publicRoutes: Route[] = [];

export { publicRoutes, privateRoutes, protectedRoutes };
