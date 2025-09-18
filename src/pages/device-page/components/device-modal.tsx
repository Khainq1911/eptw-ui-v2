import type { DeviceActionType, DeviceType } from "@/common/types/device.type";
import { Col, Form, Input, Modal, Row, Select, type FormInstance } from "antd";
import { useEffect } from "react";

export default function AddDeviceModal({
  open,
  form,
  action,
  onClose,
  handleCreateDevice,
  handleUpdateDevice,
}: {
  open: boolean;
  action: DeviceActionType;
  form: FormInstance;
  onClose: () => void;
  handleCreateDevice: (form: FormInstance) => void;
  handleUpdateDevice: (id: string, form: FormInstance<DeviceType>) => void;
}) {
  useEffect(() => {
    form.setFieldValue("active", "DVC001");
  });
  return (
    <Modal
      title="Thêm thiết bị mới"
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={() => {
        if (action.isCreate) {
          handleCreateDevice(form);
        } else if (action.isEdit) {
          handleUpdateDevice(form.getFieldValue("id"), form);
        } else {
          onClose();
        }
      }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              layout="vertical"
              label="Tên thiết bị"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên thiết bị" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              layout="vertical"
              label="Mã thiết bị"
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập tên thiết bị" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              layout="vertical"
              label="Trạng thái thiết bị"
              name="status"
              rules={[
                { required: true, message: "Vui lòng nhập tên thiết bị" },
              ]}
              hidden={action?.isCreate}
            >
              <Select
                options={[
                  { value: "active", label: "Hoạt Động" },
                  { value: "maintain", label: "Bảo trì" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              layout="vertical"
              label="Mô tả thiết bị (tùy chọn)"
              name="description"
              rules={[{ required: false }]}
            >
              <Input.TextArea placeholder="Mô tả thiết bị (tùy chọn)" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
