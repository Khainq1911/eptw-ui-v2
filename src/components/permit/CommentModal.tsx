import { Form, Input, Modal } from "antd";
import { useState } from "react";

interface CommentModalProps {
  open: boolean;
  title: string;
  loading?: boolean;
  required?: boolean;
  onOk: (comment: string) => Promise<void>;
  onCancel: () => void;
}

export default function CommentModal({
  open,
  title,
  loading = false,
  required = false,
  onOk,
  onCancel,
}: CommentModalProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await onOk(values.comment || "");
      form.resetFields();
    } catch {
      // validation failed — do nothing
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={title}
      okText="Xác nhận"
      cancelText="Hủy"
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading || submitting}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="comment"
          label="Nhận xét"
          rules={
            required
              ? [{ required: true, message: "Vui lòng nhập nhận xét" }]
              : []
          }
        >
          <Input.TextArea
            rows={4}
            placeholder={
              required ? "Nhập nhận xét (bắt buộc)" : "Nhập nhận xét (tùy chọn)"
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
