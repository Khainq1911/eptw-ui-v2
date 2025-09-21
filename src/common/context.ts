import React from "react";
import type { NotificationContextType } from "./types/auth.type";

export type ConfirmFn = (
  title: string,
  content: string,
  handleFunc: () => void
) => void;

export const ConfirmModalContext = React.createContext<ConfirmFn | null>(null);

export const NotiCreateContext = React.createContext<
  | ((
      type: NotificationContextType,
      message: string,
      description?: string
    ) => void)
  | undefined
>(undefined);
