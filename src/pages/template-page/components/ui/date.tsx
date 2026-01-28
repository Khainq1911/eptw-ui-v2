import { upperCase, debounce } from "lodash";
import type { props } from "./single-input";
import { Checkbox, Col, DatePicker, Form, Input, Row } from "antd";
import { useCallback } from "react";

export default function Date({
  field,
  section,
  handleUpdateField,
  isPreview,
}: props) {
  // Debounce 300ms cho label
  const debouncedUpdateLabel = useCallback(
    debounce((e) => {
      handleUpdateField(e, section, field, "label");
    }, 100),
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
        <DatePicker
          placeholder={field.label}
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
        />
      </Form.Item>
    );
  }

  return (
    <div>
      <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Chưa đặt tên trường"}
      </div>

      <Row gutter={16} className="items-center">
        <Col span={9}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">Nhãn</span>
            <Input
              size="small"
              placeholder="Nhập label"
              value={field.label}
              onChange={(e) => debouncedUpdateLabel(e)}
            />
          </div>
        </Col>

        <Col span={9}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">
              Chọn ngày
            </span>
            <DatePicker
              size="small"
              placeholder="Chọn ngày"
              disabled
              style={{ width: "100%" }}
            />
          </div>
        </Col>

        <Col span={6}>
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
