import { Checkbox, Col, Input, Row } from "antd";
import type { Field } from "../../template.type";

export interface props {
  field: Field;
}

export default function SingleInput({ field }: props) {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Input placeholder="Nhập label" value={field.label} />
      </Col>

      <Col span={8}>
        <Input placeholder="Input field" disabled />
      </Col>

      <Col span={8}>
        <Checkbox />
      </Col>
    </Row>
  );
}
