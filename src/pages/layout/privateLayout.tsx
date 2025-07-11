import { Navigate } from "react-router-dom";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAthenticated: boolean = true;

  if (isAthenticated) {
    return children;
  }

  return <Navigate to="/auth" />;
}
