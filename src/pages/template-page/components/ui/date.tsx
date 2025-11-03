import type { props } from "./single-input";
import { Checkbox, Col, DatePicker, Input, Row } from "antd";

export default function Date({ field, section, handleUpdateField }: props) {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Input
          placeholder="Nhập label"
          value={field.label}
          onChange={(e) => handleUpdateField(e, section, field, "label")}
        />
      </Col>

      <Col span={8}>
        <DatePicker
          placeholder="Chọn ngày"
          disabled
          style={{ width: "100%" }}
        />
      </Col>

      <Col span={8}>
        <Checkbox
          checked={field.required}
          onChange={(e) => {
            handleUpdateField(e, section, field, "required");
          }}
        />
      </Col>
    </Row>
  );
}
