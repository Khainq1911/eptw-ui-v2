// src/components/TemplateTypeFormModal.tsx
import { Modal, Form, Input } from "antd";
import type { TemplateType } from "./index.dto";
import { useEffect, useMemo } from "react";

interface Props {
  open: boolean;
  action: "create" | "update" | "view" | null;
  initialData?: TemplateType | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

export default function TemplateTypeFormModal({
  open,
  initialData,
  onCancel,
  action,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialData ?? {});
  }, [initialData]);

  const isDisabled = useMemo(() => action === "view", [action]);
  const isViewModal = useMemo(() => action === "view", [action]);

  const title = useMemo(() => {
    if (action === "create") return "Thêm Template Type";
    if (action === "update") return "Cập nhật Template Type";
    if (action === "view") return "Xem Template Type";
    return initialData ? "Cập nhật Template Type" : "Thêm Template Type";
  }, [action, initialData]);

  return (
    <Modal
      open={open}
      title={title}
      okText="Lưu"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        if (!isViewModal) {
          form.submit();
        }
      }}
      okButtonProps={{ hidden: isViewModal }}
      afterClose={() => form.resetFields()}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData ?? {}}
        onFinish={onSubmit}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Bắt buộc nhập tên" }]}
        >
          <Input disabled={isDisabled} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} disabled={isDisabled} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
