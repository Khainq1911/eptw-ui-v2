import { ConfirmModalContext } from "@/common/context";
import { Modal } from "antd";
import { type ReactNode } from "react";



export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, contextHolder] = Modal.useModal();

  const showModal = (
    title: string,
    content: string,
    handleFunc: () => void
  ) => {
    return modal.confirm({
      title,
      content,
      onOk: handleFunc,
      okText: "Confirm",
      cancelText: "Cancel",
    });
  };

  return (
    <ConfirmModalContext.Provider value={showModal}>
      {children}
      {contextHolder}
    </ConfirmModalContext.Provider>
  );
};
