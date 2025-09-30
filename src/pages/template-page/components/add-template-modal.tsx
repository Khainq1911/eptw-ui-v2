import { Modal } from "antd";
import type { SetStateAction } from "react";
import SidebarModal from "./sidebar-modal";
import ContentModal from "./content-modal";

export default function AddTemplateModal({
  openAddTemplateModal,
  setOpenAddTemplateModal,
}: {
  openAddTemplateModal: boolean;
  setOpenAddTemplateModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal
      open={openAddTemplateModal}
      onCancel={() => setOpenAddTemplateModal(false)}
      footer={null}
      closable
      width="100%"
      style={{ top: 10, maxWidth: "100vw" }}
      bodyStyle={{ height: "84vh", overflow: "hidden", padding: 0 }}
      title="Thêm mẫu giấy phép mới"
      destroyOnHidden
    >
      <div className="flex h-full">
        <div className="w-[400px]">
          <SidebarModal />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ContentModal />
        </div>
      </div>
    </Modal>
  );
}
