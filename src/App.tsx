import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes, protectedRoutes, publicRoutes } from "./router";
import PrivateLayout from "./components/layout/privateLayout.tsx";
import ProtectedLayout from "./components/layout/protectedLayout.tsx";

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
