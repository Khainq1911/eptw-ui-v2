import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes, protectedRoutes, publicRoutes } from "./router";
import { lazy } from "react";
import PrivateLayout from "./pages/layout/privateLayout.tsx";
import ProtectedLayout from "./pages/layout/protectedLayout.tsx";

const HomePage = lazy(() => import("./pages/home-page/home.tsx"));
const AuthPage = lazy(() => import("./pages/auth-page/auth.tsx"));

function App() {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        {privateRoutes.map((route, index) => {
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateLayout>
                  <Page />
                </PrivateLayout>
              }
            />
          );
        })}
        {protectedRoutes.map((route, index) => {
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedLayout roleId={route?.roleId}>
                  <Page />
                </ProtectedLayout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
