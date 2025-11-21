import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App as AntdApp } from "antd";
import App from "./App.tsx";
import { NotificationProvider } from "./components/notification.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmModalProvider } from "./components/confirmModal.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotificationProvider>
      <ConfirmModalProvider>
        <QueryClientProvider client={queryClient}>
          <AntdApp>
            <App />
          </AntdApp>
        </QueryClientProvider>
      </ConfirmModalProvider>
    </NotificationProvider>
  </StrictMode>
);
