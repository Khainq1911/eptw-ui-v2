import type { DeviceActionType, DeviceType } from "@/common/types/device.type";
import { Col, Form, Input, Modal, Row, Select, type FormInstance } from "antd";
import { useMemo } from "react";

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
  const statusOptions = useMemo(() => {
    if (action.isCreate || action.isEdit) {
      return [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Không hoạt động" },
      ];
    } else if (action.isView) {
      return [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Không hoạt động" },
        {value: "deleted", label: "Đã xóa"},
      ];
    }
  }, [action]);

  const isView = action?.isView;
  return (
    <Modal
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={() => {
        if (isView) {
          onClose(); 
        } else if (action.isCreate) {
          handleCreateDevice(form);
        } else if (action.isEdit) {
          handleUpdateDevice(form.getFieldValue("id"), form);
        }
      }}
      okButtonProps={{ style: isView ? { display: "none" } : {} }} 
    >
      <Form form={form} layout="vertical" disabled={isView}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
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
              label="Mã thiết bị"
              name="code"
              rules={[{ required: true, message: "Vui lòng nhập mã thiết bị" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Trạng thái thiết bị"
              name="status"
              initialValue="active"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select
                options={statusOptions}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
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
