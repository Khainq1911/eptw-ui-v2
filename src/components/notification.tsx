import { notification } from "antd";
import React, { useEffect } from "react";
import type { NotificationContextType } from "../common/types/auth.type";
import { setGlobalNotify } from "@/helpers/notification-helpers";

const notiCreateContext = React.createContext<
  | ((
      type: NotificationContextType,
      message: string,
      description?: string
    ) => void)
  | undefined
>(undefined);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [api, contextHolder] = notification.useNotification();

  const notify = (
    type: NotificationContextType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message: message,
      description: description,
      placement: "topRight",
      duration: 3,
    });
  };

  useEffect(() => {
    setGlobalNotify(notify);
  }, []);

  return (
    <notiCreateContext.Provider value={notify}>
      {contextHolder}
      {children}
    </notiCreateContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(notiCreateContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
};
