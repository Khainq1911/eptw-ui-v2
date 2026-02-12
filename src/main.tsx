import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App as AntdApp } from "antd";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AntdApp>
        <App />
      </AntdApp>
    </QueryClientProvider>
  </StrictMode>
);
