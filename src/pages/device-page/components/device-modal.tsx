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

  const modalTitle = useMemo(() => {
    if (action.isCreate) return "Thêm thiết bị mới";
    if (action.isEdit) return "Cập nhật thiết bị";
    if (action.isView) return "Chi tiết thiết bị";
    return "";
  }, [action]);

  return (
    <Modal
      title={<span className="text-xl font-bold text-gray-800">{modalTitle}</span>}
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
      okButtonProps={{ 
        className: "h-10 px-6 rounded-lg font-medium",
        style: isView ? { display: "none" } : {} 
      }}
      cancelButtonProps={{ className: "h-10 px-6 rounded-lg" }}
      width={600}
      centered
    >
      <Form form={form} layout="vertical" disabled={isView} className="pt-4">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={<span className="font-semibold text-gray-700">Tên thiết bị</span>}
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên thiết bị" },
              ]}
            >
              <Input placeholder="Nhập tên thiết bị (Vd: Máy hàn...)" className="h-10 rounded-lg border-gray-200" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={<span className="font-semibold text-gray-700">Mã thiết bị</span>}
              name="code"
              rules={[{ required: true, message: "Vui lòng nhập mã thiết bị" }]}
            >
              <Input placeholder="Vd: DEV-001" className="h-10 rounded-lg border-gray-200 uppercase" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<span className="font-semibold text-gray-700">Trạng thái hiện tại</span>}
              name="status"
              initialValue="active"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select
                options={statusOptions}
                className="h-10 rounded-lg border-gray-200"
                placeholder="Chọn trạng thái hoạt động"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<span className="font-semibold text-gray-700">Mô tả chi tiết</span>}
              name="description"
              rules={[{ required: false }]}
            >
              <Input.TextArea 
                placeholder="Nhập thêm các ghi chú về thiết bị nếu có..." 
                rows={4} 
                className="rounded-lg border-gray-200" 
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
