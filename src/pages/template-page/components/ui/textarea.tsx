import { Checkbox, Col, Input, Row } from "antd";
import type { props } from "./single-input";

export default function TextArea({ field, section, handleUpdateField }: props) {
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
        <Input.TextArea placeholder="Textarea field" disabled />
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
