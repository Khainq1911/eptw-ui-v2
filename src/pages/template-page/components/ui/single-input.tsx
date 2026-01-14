import { Checkbox, Col, Input, Row } from "antd";
import type { Field, Section } from "../../template-type";
import { upperCase, debounce } from "lodash";
import React, { useCallback } from "react";

export interface props {
  field: Field;
  section?: Section;
  handleUpdateField?: any;
  dispatch?: any;
}

const SingleInput = React.memo(function SingleInput({
  field,
  section,
  handleUpdateField,
}: props) {
  // Debounce cập nhật label
  const debouncedUpdateLabel = useCallback(
    debounce((value: string) => {
      handleUpdateField({ target: { value } }, section, field, "label");
    }, 100),
    [handleUpdateField, section, field]
  );

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
              defaultValue={field.label}
              onChange={(e) => debouncedUpdateLabel(e.target.value)}
            />
          </div>
        </Col>

        <Col span={9}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">Input</span>
            <Input size="small" placeholder="Input field" disabled />
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
});

export default SingleInput;
