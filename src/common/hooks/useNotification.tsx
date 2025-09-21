import React from "react";
import { NotiCreateContext } from "../context";

export const useNotification = () => {
  const context = React.useContext(NotiCreateContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
};
