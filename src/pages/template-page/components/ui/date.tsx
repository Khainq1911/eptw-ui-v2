import type { props } from "./single-input";
import { Checkbox, Col, DatePicker, Form, Input, Row } from "antd";

export default function Date({ form, index, sequence }: props) {
  return (
    <Form layout="vertical" form={form}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Label"
            name={`label_${index}_${sequence}`}
            rules={[{ required: true, message: "Vui lòng nhập trường này" }]}
          >
            <Input placeholder="Nhập label" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Placeholder" name="placeholder">
            <DatePicker
              placeholder="Chọn ngày"
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Bắt buộc"
            name={`required_${index}_${sequence}`}
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
