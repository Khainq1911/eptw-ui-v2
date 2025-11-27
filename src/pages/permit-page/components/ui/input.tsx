import { Col, Input, Row } from "antd";
import { debounce } from "lodash";
import React, { useMemo, useState } from "react";

function InputField({ field, section, dispatch, isDisable }: any) {
  const [error, setError] = useState("");
  const [localValue, setLocalValue] = useState(field.value || "");

  const debouncedDispatch = useMemo(
    () =>
      debounce(
        (val) =>
          dispatch({
            type: "SET_FIELD_VALUE",
            payload: { section, field, value: val },
          }),
        100
      ),
    [dispatch, section.id, field.id]
  );

  const handleChange = (value: string) => {
    setLocalValue(value);
    if (error) setError("");
    debouncedDispatch(value);
  };

  const handleBlur = () => {
    if (field.required && (!localValue || localValue === "")) {
      setError("Trường này là bắt buộc");
    }
  };

  return (
    <Row gutter={16} className="mb-2">
      <Col span={8}>
        <label className="font-medium mb-2">
          {field.label}{" "}
          {field.required && <span style={{ color: "red" }}>*</span>}:
        </label>
      </Col>
      <Col span={16}>
        <Input
          disabled={isDisable}
          placeholder="Nhập nội dung"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          style={{
            borderColor: error ? "red" : undefined,
            boxShadow: error ? "0 0 0 2px rgba(255,0,0,0.2)" : undefined,
          }}
        />
        {error && <div style={{ color: "red", marginTop: 4 }}>{error}</div>}
      </Col>
    </Row>
  );
}

export default React.memo(InputField);
