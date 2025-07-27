import type { NotificationContextType } from "@/common/type";

type NotifyFn = (
  type: NotificationContextType,
  message: string,
  description?: string
) => void;

let globalNotify: NotifyFn | null = null;

export const setGlobalNotify = (fn: NotifyFn) => {
  globalNotify = fn;
};

export const getGlobalNotify = () => globalNotify;
