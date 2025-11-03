import { Button, Drawer, Form, Space } from "antd";
import { useCallback, type SetStateAction } from "react";
import { useCreateTemplate } from "./create-template-service";
import SidebarModal from "../sidebar-modal";
import ContentModal from "../content-modal";
import SingleInput from "../ui/single-input";
import Date from "../ui/date";
import TextArea from "../ui/textarea";
import type { Field, Section } from "../../template.type";

export default function AddTemplateModal({
  openAddTemplateModal,
  setOpenAddTemplateModal,
}: {
  openAddTemplateModal: boolean;
  setOpenAddTemplateModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { state, dispatch } = useCreateTemplate();
  const [form] = Form.useForm();

  const handleRenderField = useCallback(
    (type: string, field: Field, section: Section, handleUpdateField: any) => {
      switch (type) {
        case "input":
          return (
            <SingleInput
              field={field}
              section={section}
              handleUpdateField={handleUpdateField}
            />
          );
        case "date":
          return (
            <Date
              field={field}
              section={section}
              handleUpdateField={handleUpdateField}
            />
          );
        case "textarea":
          return (
            <TextArea
              field={field}
              section={section}
              handleUpdateField={handleUpdateField}
            />
          );

        default:
          return null;
      }
    },
    []
  );

  return (
    <Drawer
      open={openAddTemplateModal}
      onClose={() => setOpenAddTemplateModal(false)}
      title="Thêm mẫu giấy phép mới"
      placement="right"
      width="100vw"
      destroyOnHidden
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
            <Button
              type="primary"
              onClick={() => {
                form.validateFields();
              }}
            >
              Lưu
            </Button>
          </Space>
        </div>
      }
    >
      <div className="flex h-full">
        <SidebarModal />
        <ContentModal
          state={state}
          dispatch={dispatch}
          handleRenderField={handleRenderField}
        />
      </div>
    </Drawer>
  );
}
