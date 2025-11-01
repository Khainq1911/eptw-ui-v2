import { Checkbox, Col, Form, Input, Row, type FormInstance } from "antd";

export interface props {
  form: FormInstance;
  index: number;
  sequence: number;
}

export default function TextArea({ form, index, sequence }: props) {
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
            <Input.TextArea placeholder="Nhập placeholder" disabled />
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
