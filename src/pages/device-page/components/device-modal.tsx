import { Col, Form, Input, Modal, Row, type FormInstance } from "antd";

export default function AddDeviceModal({
  open,
  form,
  onClose,
  handleCreateDevice,
}: {
  open: boolean;
  form: FormInstance;
  onClose: () => void;
  handleCreateDevice: (form: FormInstance) => void;
}) {
  
  return (
    <Modal
      title="Thêm thiết bị mới"
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={() => handleCreateDevice(form)}
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
