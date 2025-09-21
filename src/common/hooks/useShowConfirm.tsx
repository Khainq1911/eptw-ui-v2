import { useContext } from "react";
import { ConfirmModalContext } from "../context";

export const useShowConfirm = () => {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error("useConfirmModal must be used within ConfirmModalProvider");
  }
  return context;
};
