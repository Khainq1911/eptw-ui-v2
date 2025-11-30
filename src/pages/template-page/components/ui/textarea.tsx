import { Checkbox, Col, Input, Row } from "antd";
import type { props } from "./single-input";
import { upperCase, debounce } from "lodash";
import { useCallback } from "react";

export default function TextArea({ field, section, handleUpdateField }: props) {
  // Debounce update label 300ms
  const debouncedUpdateLabel = useCallback(
    debounce((value: string) => {
      handleUpdateField({ target: { value } }, section, field, "label");
    }, 300),
    []
  );

  return (
    <div>
      <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Chưa đặt tên trường"}
      </div>

      <Row gutter={16} className="items-start">
        <Col span={9}>
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

        <Col span={9}>
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
