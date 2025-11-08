import { Button, Checkbox, Col, Input, Radio, Row } from "antd";
import type { props } from "./single-input";
import { upperCase } from "lodash";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";

export default function RadioField({
  field,
  section,
  dispatch,
  handleUpdateField,
}: props) {
  const [value, setValue] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Chưa đặt tên trường"}
      </div>

      <Row gutter={16} className="items-start">
        <Col span={8}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">Nhãn</span>
            <Input
              placeholder="Nhập label"
              value={field.label}
              onChange={(e) => handleUpdateField(e, section, field, "label")}
              size="small"
            />
          </div>
        </Col>

        <Col span={10}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">
              Lựa chọn
            </span>

            <div className="flex gap-2">
              <Input
                placeholder="Nhập lựa chọn"
                size="small"
                value={value || ""}
                onChange={(e) => setValue(e.target.value)}
              />
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  if (value) {
                    dispatch({
                      type: "ADD_OPTION",
                      payload: { section, field, data: value },
                    });
                    setValue(null);
                  }
                }}
              >
                Thêm
              </Button>
            </div>

            <div className="mt-2">
              <p className="font-medium text-gray-700 mb-2">
                Danh sách lựa chọn:
              </p>

              <Radio.Group
                className="w-full flex flex-col gap-2"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {field?.options?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition"
                  >
                    <Radio value={item} className="text-gray-800 text-sm">
                      {item}
                    </Radio>

                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      className="!p-1 hover:!bg-red-50"
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_OPTION",
                          payload: { section, field, index },
                        })
                      }
                    />
                  </div>
                ))}
              </Radio.Group>
            </div>
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
