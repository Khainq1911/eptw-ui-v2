import type {
  WorkActivityType,
  WorkActivityActionType,
} from "@/common/types/work-activity.type";
import { Col, Form, Input, Modal, Row, Select, type FormInstance } from "antd";

const CATEGORY_OPTIONS = [
  { value: "construction", label: "Xây dựng" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "inspection", label: "Kiểm tra" },
  { value: "electrical", label: "Điện" },
  { value: "mechanical", label: "Cơ khí" },
  { value: "chemical", label: "Hóa chất" },
  { value: "other", label: "Khác" },
];

const RISK_LEVEL_OPTIONS = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

export default function WorkActivityModal({
  open,
  form,
  action,
  onClose,
  handleCreate,
  handleUpdate,
}: {
  open: boolean;
  action: WorkActivityActionType;
  form: FormInstance;
  onClose: () => void;
  handleCreate: (form: FormInstance) => void;
  handleUpdate: (id: number, form: FormInstance<WorkActivityType>) => void;
}) {
  const isView = action?.isView;

  const getTitle = () => {
    if (action.isCreate) return "Thêm hoạt động mới";
    if (action.isEdit) return "Chỉnh sửa hoạt động";
    if (action.isView) return "Chi tiết hoạt động";
    return "Hoạt động";
  };

  return (
    <Modal
      title={getTitle()}
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={() => {
        if (isView) {
          onClose();
        } else if (action.isCreate) {
          handleCreate(form);
        } else if (action.isEdit) {
          handleUpdate(form.getFieldValue("id"), form);
        }
      }}
      okText={isView ? "Đóng" : action.isCreate ? "Thêm" : "Cập nhật"}
      cancelText="Hủy"
      okButtonProps={{ style: isView ? { display: "none" } : {} }}
      width={600}
    >
      <Form form={form} layout="vertical" disabled={isView}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Tên hoạt động"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên hoạt động" },
              ]}
            >
              <Input placeholder="Nhập tên hoạt động" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Danh mục" name="category">
              <Select
                placeholder="Chọn danh mục"
                options={CATEGORY_OPTIONS}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Mức độ rủi ro"
              name="riskLevel"
              rules={[
                { required: true, message: "Vui lòng chọn mức độ rủi ro" },
              ]}
            >
              <Select
                placeholder="Chọn mức độ rủi ro"
                options={RISK_LEVEL_OPTIONS}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea
                placeholder="Nhập mô tả hoạt động (tùy chọn)"
                rows={4}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
