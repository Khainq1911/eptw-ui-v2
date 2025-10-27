import { Button, Drawer, Space } from "antd";
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
    <Drawer
      open={openAddTemplateModal}
      onClose={() => setOpenAddTemplateModal(false)}
      title="Thêm mẫu giấy phép mới"
      placement="right"
      width="100vw"
      styles={{
        body: {
          padding: 0,
        },
      }}
      extra={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button icon={<span>✏️</span>} type="primary">
              Chỉnh sửa
            </Button>
            <Button icon={<span>👁️</span>}>Xem trước</Button>
          </Space>
        </div>
      }
      footer={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button
              onClick={() => setOpenAddTemplateModal(false)}
              type="primary"
              danger
            >
              Hủy bỏ
            </Button>
            <Button type="primary">Lưu</Button>
          </Space>
        </div>
      }
    >
      <div className="flex h-full">
        <SidebarModal />
        <ContentModal />
      </div>
    </Drawer>
  );
}
