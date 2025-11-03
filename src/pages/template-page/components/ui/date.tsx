import type { props } from "./single-input";
import { Checkbox, Col, DatePicker, Input, Row } from "antd";

export default function Date({ field }: props) {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Input placeholder="Nhập label" value={field.label} />
      </Col>

      <Col span={8}>
        <DatePicker
          placeholder="Chọn ngày"
          disabled
          style={{ width: "100%" }}
        />
      </Col>

      <Col span={8}>
        <Checkbox />
      </Col>
    </Row>
  );
}
