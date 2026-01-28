import { Button, Checkbox, Col, Form, Input, Radio, Row } from "antd";
import type { props } from "./single-input";
import { upperCase, debounce } from "lodash";
import { useState, useCallback } from "react";
import { DeleteOutlined } from "@ant-design/icons";

export default function RadioField({
  field,
  section,
  dispatch,
  handleUpdateField,
  isPreview,
}: props) {
  const [value, setValue] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // Debounce update label
  const debouncedUpdateLabel = useCallback(
    debounce((value: string) => {
      handleUpdateField({ target: { value } }, section, field, "label");
    }, 100),
    [handleUpdateField, section, field]
  );

  // Debounce input option
  const debouncedOptionInput = useCallback(
    debounce((val: string) => setValue(val), 200),
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
        <Radio.Group className="w-full flex flex-col gap-2">
          {field?.options?.map((item, index) => (
            <div key={index} className="flex items-center">
              <Radio value={item} className="text-gray-800 text-sm">
                {item}
              </Radio>
            </div>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  }

  return (
    <div>
      <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Chưa đặt tên trường"}
      </div>

      <Row gutter={16} className="items-start">
        {/* LABEL */}
        <Col span={8}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">Nhãn</span>
            <Input
              placeholder="Nhập label"
              defaultValue={field.label}
              onChange={(e) => debouncedUpdateLabel(e.target.value)}
              size="small"
            />
          </div>
        </Col>

        {/* OPTIONS */}
        <Col span={10}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">
              Lựa chọn
            </span>

            <div className="flex gap-2">
              <Input
                placeholder="Nhập lựa chọn"
                size="small"
                defaultValue={value || ""}
                onChange={(e) => debouncedOptionInput(e.target.value)}
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

        {/* REQUIRED */}
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
