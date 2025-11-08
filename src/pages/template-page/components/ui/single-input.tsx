import { Checkbox, Col, Input, Row } from "antd";
import type { Field, Section } from "../../template-type";
import { upperCase } from "lodash";

export interface props {
  field: Field;
  section?: Section;
  handleUpdateField?: any;
  dispatch?: any;
}

export default function SingleInput({
  field,
  section,
  handleUpdateField,
}: props) {
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
              onChange={(e) => handleUpdateField(e, section, field, "label")}
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
}
