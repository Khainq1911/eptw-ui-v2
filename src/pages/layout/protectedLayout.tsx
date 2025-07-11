import { Navigate } from "react-router-dom";

export default function ProtectedLayout({
  children,
  roleId,
}: {
  children: React.ReactNode;
  roleId: number | undefined;
}) {
  const userId = 1;
  const routeId = roleId;
  const isAuth = false;

  if (!isAuth) return <Navigate to="/auth" />;

  if (userId !== routeId) return <Navigate to="/home" />;

  return children;
}
