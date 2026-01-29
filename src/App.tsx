import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  permitRoutes,
  privateRoutes,
  protectedRoutes,
  publicRoutes,
} from "./router";
import PrivateLayout from "./configs/layout/privateLayout.tsx";
import ProtectedLayout from "./configs/layout/protectedLayout.tsx";
import PermitLayout from "./configs/layout/permitLayout.tsx";

function App() {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}

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
                <ProtectedLayout roles={route?.roles}>
                  <Page />
                </ProtectedLayout>
              }
            />
          );
        })}

        {permitRoutes.map((route, index) => {
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PermitLayout>
                  <Page />
                </PermitLayout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
