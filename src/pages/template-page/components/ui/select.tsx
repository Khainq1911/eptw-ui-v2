import { Button, Checkbox, Col, Form, Input, Row, Select } from "antd";
import type { props } from "./single-input";
import { upperCase, debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";

const SelectField = React.memo(function SelectField({
  field,
  section,
  dispatch,
  handleUpdateField,
  isPreview,
}: props) {
  const [value, setValue] = useState<string>("");

  // Debounce update label to avoid global re-render on every keystroke
  const debouncedUpdateLabel = useCallback(
    debounce((val: string) => {
      handleUpdateField({ target: { value: val } }, section, field, "label");
    }, 300),
    [handleUpdateField, section, field]
  );

  if (isPreview) {
    return (
      <Form.Item
        className="mb-0"
        required={field.required}
        label={field.label || "Chưa đặt tên trường"}
        layout="vertical"
      >
        <Select
          placeholder="Chọn một mục"
          allowClear
          style={{ width: "100%" }}
          options={field?.options?.map((item) => ({
            label: item,
            value: item,
          }))}
        />
      </Form.Item>
    );
  }

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
              defaultValue={field.label}
              onChange={(e) => debouncedUpdateLabel(e.target.value)}
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
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

              <Button
                size="small"
                type="primary"
                onClick={() => {
                  if (!value.trim()) return;
                  dispatch({
                    type: "ADD_OPTION",
                    payload: { section, field, data: value },
                  });
                  setValue("");
                }}
              >
                Thêm
              </Button>
            </div>

            <div className="mt-2">
              <p className="font-medium text-gray-700 mb-2">
                Danh sách lựa chọn:
              </p>

              <div className="w-full flex flex-col gap-2">
                {field?.options?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition"
                  >
                    <span className="text-gray-800 text-sm">{item}</span>

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
              </div>
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
});

export default SelectField;
