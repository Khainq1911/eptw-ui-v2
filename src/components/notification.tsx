import { notification } from "antd";
import React from "react";
import type { NotificationContextType } from "../common/types/auth.type";
import { NotiCreateContext } from "@/common/context";

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

  return (
    <NotiCreateContext.Provider value={notify}>
      {contextHolder}
      {children}
    </NotiCreateContext.Provider>
  );
};


