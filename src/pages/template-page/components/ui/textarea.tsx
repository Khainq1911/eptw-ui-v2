import { Checkbox, Col, Form, Input, Row } from "antd";
import type { props } from "./single-input";
import { upperCase, debounce } from "lodash";
import { useCallback } from "react";

export default function TextArea({
  field,
  section,
  handleUpdateField,
  isPreview,
}: props) {
  // Debounce update label 300ms
  const debouncedUpdateLabel = useCallback(
    debounce((value: string) => {
      handleUpdateField({ target: { value } }, section, field, "label");
    }, 300),
    []
  );

  if (isPreview) {
    return (
      <Form.Item
        className="mb-0"
        required={field.required}
        label={field.label || "Chưa đặt tên trường"}
        layout="vertical"
      >
        <Input.TextArea placeholder={field.label} />
      </Form.Item>
    );
  }

  return (
    <div>
      <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Chưa đặt tên trường"}
      </div>

      <Row gutter={[16, 16]} className="items-start">
        <Col xs={24} sm={9}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">Nhãn</span>
            <Input
              size="small"
              placeholder="Nhập label"
              defaultValue={field.label}
              onChange={(e) => debouncedUpdateLabel(e.target.value)}
            />
          </div>
        </Col>

        <Col xs={24} sm={9}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">
              Textarea
            </span>
            <Input.TextArea
              size="small"
              placeholder="Textarea field"
              disabled
            />
          </div>
        </Col>

        <Col xs={24} sm={6}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">
              Bắt buộc
            </span>
            <Checkbox
              checked={field.required}
              onChange={(e) => handleUpdateField(e, section, field, "required")}
            >
              Bắt buộc
            </Checkbox>
          </div>
        </Col>
      </Row>
    </div>
  );
}
