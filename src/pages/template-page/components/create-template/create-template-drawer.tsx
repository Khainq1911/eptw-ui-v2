import { Button, Drawer, Form, Space } from "antd";
import { useCallback, type SetStateAction } from "react";
import { useCreateTemplate } from "./create-template-service";
import SidebarModal from "../sidebar-modal";
import ContentModal from "../content-modal";
import SingleInput from "../ui/single-input";
import Date from "../ui/date";
import TextArea from "../ui/textarea";

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
    (type: string, index: number, sequence: number) => {
      switch (type) {
        case "input":
          return <SingleInput form={form} index={index} sequence={sequence} />;
        case "date": 
          return <Date form={form} index={index} sequence={sequence} />;
        case "textarea":
          return <TextArea form={form} index={index} sequence={sequence} />;

        default:
          return null;
      }
    },
    [form]
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
          form={form}
          dispatch={dispatch}
          handleRenderField={handleRenderField}
        />
      </div>
    </Drawer>
  );
}
